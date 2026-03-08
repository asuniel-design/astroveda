import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_CONTENT?.replace(/\/$/, '') || '';
  const candidates = [`${base}/services`];
  for (const url of candidates) {
    try {
      const r = await fetch(url);
      if (r.ok) return res.status(200).json(await r.json());
    } catch {}
  }
  return res.status(200).json({ services: [
    { id: 1, name: 'Daily Horoscope', icon: '🌟', description: 'Know what stars say today', route: '/horoscope' },
    { id: 2, name: 'Free Kundli', icon: '📜', description: 'Get your birth chart', route: '/kundli' },
    { id: 3, name: 'Compatibility Match', icon: '💑', description: 'Find your perfect match', route: '/kundli' },
    { id: 4, name: 'Tarot Reading', icon: '🎴', description: 'Unlock hidden answers', route: '/tarot' },
  ]});
}
