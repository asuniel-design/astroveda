import type { NextApiRequest, NextApiResponse } from "next";

const CONTENT = process.env.NEXT_PUBLIC_CONTENT;

async function tryFetch(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const country =
      (req.headers["x-vercel-ip-country"] as string) ||
      (req.headers["cf-ipcountry"] as string) ||
      (req.cookies?.av_country as string) ||
      "IN";

    const isIN = country === "IN";

    // MVP marketing tiers (strictly enforce USD outside India)
    const USD_OVERRIDES: Record<number, number> = {
      299: 3.99,
      349: 3.99,
      399: 4.99,
      499: 5.99,
    };

    const fxInrPerUsd = 83; // fallback conversion

    function inrToUsd(inr: number) {
      return USD_OVERRIDES[inr] ?? Number((inr / fxInrPerUsd).toFixed(2));
    }

    const fallback = [
      { id: "r1", title: "Celestial Protection", description: "Ward off negativity with Vedic rituals.", price_inr: 299, category: "Remedy" },
      { id: "r2", title: "Prosperity Pooja", description: "Attract abundance and career growth.", price_inr: 499, category: "Pooja" },
      { id: "r3", title: "Relationship Harmony", description: "Bring balance and clarity to love life.", price_inr: 399, category: "Love" },
      { id: "r4", title: "Health Shield", description: "Strengthen energy and wellbeing.", price_inr: 349, category: "Health" }
    ];

    function mapPricing(arr: any[]) {
      return arr.map((r: any) => {
        const priceInr = Number(r.price_inr ?? r.price ?? r.amount ?? 0) || 0;
        const display_price = isIN ? priceInr : inrToUsd(priceInr);
        const display_currency = isIN ? "INR" : "USD";
        const display_symbol = isIN ? "₹" : "$";
        return { ...r, display_price, display_currency, display_symbol };
      });
    }

    if (!CONTENT) {
      return res.status(200).json({
        remedies: mapPricing(fallback),
        pricing: { country, currency: isIN ? "INR" : "USD", symbol: isIN ? "₹" : "$", fxInrPerUsd },
        source: "fallback"
      });
    }

    const base = CONTENT.replace(/\/$/, "");

    // Try common endpoints
    const candidates = [`${base}/remedies`, `${base}/remedy`, `${base}/store/remedies`];

    for (const url of candidates) {
      try {
        const data = await tryFetch(url);
        // normalize common shapes
        const raw = data?.remedies ?? data?.items ?? data;
        const arr = Array.isArray(raw) ? raw : [];

        const remedies = arr.map((r: any) => {
          const priceInr = Number(r.price_inr ?? r.price ?? r.amount ?? 0) || 0;
          const display_price = isIN ? priceInr : inrToUsd(priceInr);
          const display_currency = isIN ? "INR" : "USD";
          const display_symbol = isIN ? "₹" : "$";
          return { ...r, display_price, display_currency, display_symbol };
        });

        return res.status(200).json({
          remedies,
          pricing: {
            country,
            currency: isIN ? "INR" : "USD",
            symbol: isIN ? "₹" : "$",
            fxInrPerUsd,
          },
        });
      } catch {
        // continue
      }
    }

    return res.status(200).json({
      remedies: mapPricing(fallback),
      pricing: { country, currency: isIN ? "INR" : "USD", symbol: isIN ? "₹" : "$", fxInrPerUsd },
      source: "fallback"
    });
  } catch (e: any) {
    return res.status(200).json({ remedies: [], error: e?.message || "error" });
  }
}
