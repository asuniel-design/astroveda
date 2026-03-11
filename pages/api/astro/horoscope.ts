import type { NextApiRequest, NextApiResponse } from "next";

const ENGINE = process.env.NEXT_PUBLIC_ASTROLOGY_ENGINE;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dob, time, city } = req.query;

  const fallback = {
    ok: true,
    source: "fallback",
    input: { dob, time, city },
    text: "Today: stay focused, avoid impulsive decisions, and communicate clearly. (MVP fallback until engine wiring is confirmed.)",
  };

  try {
    if (!ENGINE) return res.status(200).json(fallback);
    const base = ENGINE.replace(/\/$/, "");

    const candidates = [
      `${base}/horoscope?dob=${encodeURIComponent(String(dob || ""))}&time=${encodeURIComponent(String(time || ""))}&city=${encodeURIComponent(String(city || ""))}`,
      `${base}/horoscope/daily?dob=${encodeURIComponent(String(dob || ""))}&time=${encodeURIComponent(String(time || ""))}&city=${encodeURIComponent(String(city || ""))}`,
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
