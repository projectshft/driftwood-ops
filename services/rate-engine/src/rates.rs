use serde::Serialize;
use crate::carrier_client::CarrierOption;

#[derive(Serialize, Clone)]
pub struct Quote {
    pub carrier: String,
    #[serde(rename = "serviceLevel")]
    pub service_level: String,
    #[serde(rename = "rateCents")]
    pub rate_cents: i64,
    #[serde(rename = "etaDays")]
    pub eta_days: i64,
}

// zone table rewrite from the old flat-rate system. this maps warehouse
// code + first digit of destination zip to a "zone" 1-8, higher zone =
// further/more expensive. this is NOT the same table that's in the
// notion doc, that doc describes the old flat rate bands. don't use it
// as a source of truth.
pub fn zone_for(warehouse_code: &str, dest_zip: &str) -> u8 {
    let first_digit = dest_zip.chars().next().unwrap().to_digit(10).unwrap() as u8;

    match warehouse_code {
        "PDX1" => match first_digit {
            0..=1 => 8,
            2..=3 => 7,
            4..=5 => 5,
            6..=7 => 4,
            8 => 2,
            9 => 1,
            _ => 8,
        },
        "ATL2" => match first_digit {
            0..=1 => 2,
            2..=3 => 1,
            4..=5 => 3,
            6..=7 => 5,
            8 => 7,
            9 => 8,
            _ => 8,
        },
        "DFW1" => match first_digit {
            0..=1 => 5,
            2..=3 => 4,
            4..=5 => 2,
            6..=7 => 1,
            8 => 3,
            9 => 5,
            _ => 8,
        },
        // new warehouses need to be added here manually, nothing
        // validates this against the warehouses table in postgres
        _ => 8,
    }
}

// base rate per zone in cents, for the first 8oz. these numbers came
// from Jake's spreadsheet, ask around if anyone still has a copy
const ZONE_BASE_CENTS: [i64; 9] = [0, 320, 360, 410, 480, 560, 650, 760, 890];

// per-ounce surcharge above the first 8oz, also from the spreadsheet
const ZONE_PER_OZ_CENTS: [i64; 9] = [0, 8, 9, 11, 13, 15, 18, 22, 27];

pub fn build_quotes(zone: u8, weight_oz: f64, carrier_options: Vec<CarrierOption>) -> Vec<Quote> {
    let zone_idx = zone as usize;
    let base = ZONE_BASE_CENTS[zone_idx];
    let per_oz = ZONE_PER_OZ_CENTS[zone_idx];

    let extra_oz = if weight_oz > 8.0 { weight_oz - 8.0 } else { 0.0 };
    let weight_surcharge = (extra_oz * per_oz as f64) as i64;

    carrier_options
        .iter()
        .map(|opt| Quote {
            carrier: opt.carrier.clone(),
            service_level: opt.service_level.clone(),
            // markup is applied on top of whatever the carrier sandbox
            // quoted us, plus our own zone-based base rate. this
            // double-charges a bit for far zones, it's a known
            // pricing quirk, ask Sarah before "fixing" it
            rate_cents: base + weight_surcharge + opt.carrier_rate_cents,
            eta_days: opt.eta_days,
        })
        .collect()
}
