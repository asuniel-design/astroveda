import type { NextApiRequest, NextApiResponse } from "next";

const ENGINE = process.env.NEXT_PUBLIC_ASTROLOGY_ENGINE;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dob, time, city } = req.query;

  // MVP fallback if engine not reachable
  const fallback = {
    ok: true,
    source: "fallback",
    input: { dob, time, city },
    snapshot: {
      lagna: "Aries",
      moonSign: "Cancer",
      notes: "Wire this to the astrology engine endpoint when available.",
    },
  };

  try {
    if (!ENGINE) return res.status(200).json(fallback);
    const base = ENGINE.replace(/\/$/, "");

    // Try a couple common endpoint shapes
    const candidates = [
      `${base}/kundli?dob=${encodeURIComponent(String(dob || ""))}&time=${encodeURIComponent(String(time || ""))}&city=${encodeURIComponent(String(city || ""))}`,
      `${base}/kundli/generate?dob=${encodeURIComponent(String(dob || ""))}&time=${encodeURIComponent(String(time || ""))}&city=${encodeURIComponent(String(city || ""))}`,
    ];

    for (const url of candidates) {
      try {
        const upstream = await fetch(url, { headers: { Accept: "application/json" } });
        if (!upstream.ok) continue;
        const data = await upstream.json();
        return res.status(200).json(data);
      } catch {
        // continue
      }
    }

    return res.status(200).json(fallback);
  } catch {
    return res.status(200).json(fallback);
  }
}
