import type { NextApiRequest, NextApiResponse } from "next";

import { translateDeep } from "../../../lib/translator";

const ENGINE = process.env.NEXT_PUBLIC_ASTROLOGY_ENGINE;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dob, time, city, locale } = req.query;

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
    const target = typeof locale === "string" ? locale : null;

    if (!ENGINE) {
      const out = target ? await translateDeep({ value: fallback, target }) : fallback;
      return res.status(200).json(out);
    }
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
        const out = target ? await translateDeep({ value: data, target }) : data;
        return res.status(200).json(out);
      } catch {
        // continue
      }
    }

    {
      const out = target ? await translateDeep({ value: fallback, target }) : fallback;
      return res.status(200).json(out);
    }
  } catch {
    const target = typeof locale === "string" ? locale : null;
    const out = target ? await translateDeep({ value: fallback, target }) : fallback;
    return res.status(200).json(out);
  }
}
