import type { NextApiRequest, NextApiResponse } from 'next';

async function tryFetch(url: string) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const content = process.env.NEXT_PUBLIC_CONTENT?.replace(/\/$/, '') || '';
  const consults = process.env.NEXT_PUBLIC_CONSULTATIONS?.replace(/\/$/, '') || '';
  const candidates = [
    `${content}/astrologers`,
    `${consults}/astrologers`,
    `${consults}/experts/list`,
  ].filter(Boolean);

  for (const url of candidates) {
    try {
      const data = await tryFetch(url);
      return res.status(200).json(data);
    } catch {}
  }

  // Fallback dynamic sample
  return res.status(200).json({ astrologers: [
    { id: 'ag', name: 'Acharya Gupta', rating: 4.95, is_online: true, expertise: ['Vastu','Gemology'], languages: ['Hindi','English'], price_per_minute: 65, is_verified: true },
    { id: 'ps', name: 'Pandit Sharma', rating: 4.9, is_online: true, expertise: ['Vedic','KP'], languages: ['Hindi','English'], price_per_minute: 45, is_verified: true },
    { id: 'jp', name: 'Jyotish Patel', rating: 4.8, is_online: true, expertise: ['Nakshatra','Muhurta'], languages: ['Gujarati','English'], price_per_minute: 55, is_verified: true }
  ]});
}
