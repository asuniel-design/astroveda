import type { NextApiRequest, NextApiResponse } from "next";

const CONTENT = process.env.NEXT_PUBLIC_CONTENT;

async function tryFetch(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!CONTENT) return res.status(200).json({ remedies: [] });
    const base = CONTENT.replace(/\/$/, "");

    // Try common endpoints
    const candidates = [`${base}/remedies`, `${base}/remedy`, `${base}/store/remedies`];

    for (const url of candidates) {
      try {
        const data = await tryFetch(url);
        // normalize common shapes
        const remedies = data?.remedies ?? data?.items ?? data;
        return res.status(200).json({ remedies });
      } catch {
        // continue
      }
    }

    return res.status(200).json({ remedies: [] });
  } catch (e: any) {
    return res.status(200).json({ remedies: [], error: e?.message || "error" });
  }
}
