export type CurrencyCode = "USD" | "INR";

// Commercial rounding rules for a polished storefront feel.
// - USD >= 5.00 -> nearest .99 (classic charm pricing)
// - USD < 5.00  -> round UP to next .49 or .99 (never drops below perceived value)
export function roundUsdCommercial(input: number) {
  const usd = Number(input);
  if (!Number.isFinite(usd) || usd <= 0) return 0;

  if (usd >= 5) {
    const floor = Math.floor(usd);
    const lower = Math.max(0.99, floor - 1 + 0.99); // e.g. 6.01 -> 5.99
    const upper = floor + 0.99; // e.g. 6.80 -> 6.99
    return Math.abs(usd - lower) <= Math.abs(upper - usd) ? lower : upper;
  }

  const floor = Math.floor(usd);
  const c1 = floor + 0.49;
  const c2 = floor + 0.99;
  if (usd <= c1) return c1;
  if (usd <= c2) return c2;
  return floor + 1 + 0.49;
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  if (currency === "USD") return n.toFixed(2);
  return String(Math.round(n));
}
