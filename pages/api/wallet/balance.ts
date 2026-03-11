import type { NextApiRequest, NextApiResponse } from "next";

const WALLET = process.env.NEXT_PUBLIC_WALLET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = String(req.query.userId || "user1");

    if (!WALLET) return res.status(200).json({ balance: 0, currency: "INR" });
    const base = WALLET.replace(/\/$/, "");

    const url = `${base}/balance?userId=${encodeURIComponent(userId)}`;
    const upstream = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await upstream.text();

    res.status(upstream.status).setHeader("Content-Type", "application/json");
    return res.send(text);
  } catch {
    return res.status(200).json({ balance: 0, currency: "INR" });
  }
}
