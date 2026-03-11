import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body || {};
  const text = typeof message === "string" ? message.trim() : "";

  // Soft-launch MVP: simple deterministic reply. Replace with real consult/chat backend later.
  const reply = text
    ? `I hear you: "${text}". (MVP chat) — Next: we’ll connect this to the consultations engine + wallet timer.`
    : "Please type a message.";

  return res.status(200).json({ reply });
}
