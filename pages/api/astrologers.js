import prisma from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const astrologers = await prisma.astrologer.findMany({
      where: { is_blocked: false },
      select: {
        id: true,
        name: true,
        bio: true,
        avatar_url: true,
        expertise: true,
        languages: true,
        experience_years: true,
        price_per_minute: true,
        price_per_chat_minute: true,
        price_per_call_minute: true,
        price_per_video_minute: true,
        status: true,
        is_online: true,
        is_busy: true,
        last_active: true,
        is_verified: true,
        rating: true,
        total_ratings: true,
        response_time_avg: true,
        completion_rate: true,
      },
      orderBy: [
        { is_online: 'desc' },
        { rating: 'desc' },
        { total_ratings: 'desc' },
      ],
      take: 50,
    });

    // Map to UI-friendly format with availability status
    const mapped = astrologers.map(a => ({
      ...a,
      price_per_minute: Number(a.price_per_minute),
      price_per_chat_minute: a.price_per_chat_minute ? Number(a.price_per_chat_minute) : null,
      price_per_call_minute: a.price_per_call_minute ? Number(a.price_per_call_minute) : null,
      price_per_video_minute: a.price_per_video_minute ? Number(a.price_per_video_minute) : null,
      availability: a.is_online ? (a.is_busy ? 'ONLINE_BUSY' : 'ONLINE_AVAILABLE') : 'OFFLINE',
    }));

    res.status(200).json({ astrologers: mapped, total: mapped.length });
  } catch (error) {
    console.error('Astrologers API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch astrologers', details: error.message });
  }
}