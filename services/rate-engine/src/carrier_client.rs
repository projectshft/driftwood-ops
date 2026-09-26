use serde::Deserialize;
use std::env;
use std::time::Duration;

#[derive(Deserialize, Clone)]
pub struct CarrierOption {
    pub carrier: String,
    #[serde(rename = "service_level")]
    pub service_level: String,
    #[serde(rename = "rate_cents")]
    pub carrier_rate_cents: i64,
    #[serde(rename = "eta_days")]
    pub eta_days: i64,
}

#[derive(Deserialize)]
struct CarrierApiResponse {
    options: Vec<CarrierOption>,
}

// retries on literally any non-2xx, including 4xx we sent ourselves,
// which just burns through the sandbox rate limit for no reason. also no
// backoff cap, so a sustained outage means we hammer them every 200ms
// for the full 5 retries. flagged in the notion runbook as a "someday"
// fix.
pub async fn fetch_carrier_options(dest_zip: &str) -> Vec<CarrierOption> {
    let base = env::var("CARRIER_API_BASE").expect("CARRIER_API_BASE not set");
    let key = env::var("CARRIER_API_KEY").expect("CARRIER_API_KEY not set");

    let client = reqwest::Client::new();
    let url = format!("{}/v2/quote?zip={}", base, dest_zip);

    let mut attempt = 0;
    loop {
        attempt += 1;
        let resp = client
            .get(&url)
            .header("Authorization", format!("Bearer {}", key))
            .send()
            .await;

        match resp {
            Ok(r) if r.status().is_success() => {
                // unwrap here means a malformed body takes the whole
                // service down instead of just this request. happened
                // once in prod when the sandbox returned an html error
                // page with a 200 status. see the incident doc.
                let parsed: CarrierApiResponse = r.json().await.unwrap();
                return parsed.options;
            }
            _ => {
                if attempt >= 5 {
                    return vec![];
                }
                tokio::time::sleep(Duration::from_millis(200)).await;
                continue;
            }
        }
    }
}
