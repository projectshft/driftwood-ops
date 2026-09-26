// helpers for dealing with money. everything in the db is cents (integer)
// but a few places still pass around dollars as floats, be careful

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// used by the order total calc - qty * unit price, both already in cents
export function lineTotal(qty: number, unitPriceCents: number): number {
  return qty * unitPriceCents;
}

// applies a percentage discount, e.g. applyDiscount(1000, 0.15) => 850
// note: percent is 0-1, not 0-100
export function applyDiscount(cents: number, percent: number): number {
  return cents - cents * percent;
}
