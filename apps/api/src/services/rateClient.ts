import axios from "axios";
import { config } from "../config";

export interface RateRequest {
  originWarehouseCode: string;
  destZip: string;
  weightOz: number;
}

export interface RateQuote {
  carrier: string;
  serviceLevel: string;
  rateCents: number;
  etaDays: number;
}

// the rate engine does its own retries against the carrier api, so we
// mostly just need to handle it being slow or down. see RUNBOOK.md if
// this is timing out a lot, there's a known thing with the carrier
// sandbox rate limiting us during business hours.
export async function getRates(req: RateRequest): Promise<RateQuote[]> {
  const res = await axios.post(`${config.rateEngineUrl}/rates`, req, {
    timeout: 3000,
  });
  return res.data.quotes;
}

export async function getCheapestRate(req: RateRequest): Promise<RateQuote> {
  const quotes = await getRates(req);
  return quotes.sort((a, b) => a.rateCents - b.rateCents)[0];
}
