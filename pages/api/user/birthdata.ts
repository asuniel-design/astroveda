import type { NextApiRequest, NextApiResponse } from "next";

// MVP placeholder:
// - If your backend exposes a real user profile endpoint or DATABASE_URL is added, replace this.
// - For demo, returns sample birthData for user1.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = String(req.query.userId || "");

  if (!userId) return res.status(200).json({ birthData: null });

  if (userId === "user1") {
    return res.status(200).json({
      birthData: { dob: "1996-06-12", time: "08:15", city: "Chennai" },
    });
  }

  return res.status(200).json({ birthData: null });
}
