import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_CONTENT?.replace(/\/$/, '') || '';
  const candidates = [`${base}/testimonials`];
  for (const url of candidates) {
    try {
      const r = await fetch(url);
      if (r.ok) return res.status(200).json(await r.json());
    } catch {}
  }
  return res.status(200).json({ testimonials: [
    { id: 1, name: 'Ramesh K.', rating: 5, review: 'Dr. Sharma predicted my career change accurately. Highly recommended!' },
    { id: 2, name: 'Sneha P.', rating: 5, review: 'Priya helped me through tough times with her tarot readings. Forever grateful.' },
    { id: 3, name: 'Vikash M.', rating: 5, review: 'Best astrology platform in India. Genuine experts and quick responses.' }
  ]});
}
