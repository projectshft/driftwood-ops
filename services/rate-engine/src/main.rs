mod rates;
mod carrier_client;

use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct RateRequest {
    #[serde(rename = "originWarehouseCode")]
    origin_warehouse_code: String,
    #[serde(rename = "destZip")]
    dest_zip: String,
    #[serde(rename = "weightOz")]
    weight_oz: f64,
}

#[derive(Serialize)]
struct RateResponse {
    quotes: Vec<rates::Quote>,
}

async fn quote_rates(Json(req): Json<RateRequest>) -> Json<RateResponse> {
    let zone = rates::zone_for(&req.origin_warehouse_code, &req.dest_zip);
    let carrier_options = carrier_client::fetch_carrier_options(&req.dest_zip).await;

    let quotes = rates::build_quotes(zone, req.weight_oz, carrier_options);

    Json(RateResponse { quotes })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/rates", post(quote_rates));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("rate-engine listening on 0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}
