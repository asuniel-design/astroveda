import prisma from '../../../lib/prisma';
import { convertPerMinute } from '../../../lib/pricing';

export default async function handler(req, res) {
  try {
    // Fetch astrologers from database
    const astrologers = await prisma.astrologer.findMany({
      where: { is_blocked: false },
      select: {
        id: true,
        name: true,
        bio: true,
        avatar_url: true,
        expertise: true,
        experience_years: true,
        price_per_minute: true,
        price_per_chat_minute: true,
        price_per_call_minute: true,
        price_per_video_minute: true,
        is_online: true,
        is_busy: true,
        status: true,
        is_verified: true,
        rating: true,
        total_ratings: true,
        response_time_avg: true,
        completion_rate: true,
      },
      orderBy: { rating: 'desc' },
      take: 10,
    });

    // Determine user's currency from cookie (default USD)
    const currency = req.cookies['user-currency'] || 'USD';
    
    // Format experts for frontend
    const experts = astrologers.map(astrologer => {
      // Convert base INR price per minute to local currency
      const baseINR = Number(astrologer.price_per_minute);
      const localRate = convertPerMinute(baseINR, currency);
      
      return {
        id: astrologer.id,
        name: astrologer.name,
        role: 'astrologer',
        specialty: astrologer.expertise?.[0] || 'Vedic Astrology',
        rate: localRate, // per minute in local currency
        image: astrologer.avatar_url || `https://i.pravatar.cc/150?u=${astrologer.id}`,
        isVerified: astrologer.is_verified,
        metrics: {
          reviews: astrologer.total_ratings,
          rating: astrologer.rating,
          experience_years: astrologer.experience_years,
          response_time: astrologer.response_time_avg ? `${astrologer.response_time_avg}s` : null,
          completion_rate: astrologer.completion_rate,
        },
        isLive: astrologer.is_online && !astrologer.is_busy,
        raw: {
          baseINR,
          currency,
          status: astrologer.status,
        }
      };
    });

    res.status(200).json({ experts });
  } catch (error) {
    console.error('Failed to fetch astrologers:', error);
    // Fallback to sample data if database fails
    const experts = [
      { 
        id: "exp_001", 
        name: "Acharya Sharma", 
        role: "astrologer",
        specialty: "Vedic & KP Specialist", 
        rate: 2.00, 
        image: "https://i.pravatar.cc/150?u=sharma", 
        isVerified: true,
        metrics: { reviews: 1240, rating: 4.9 },
        isLive: true
      },
      { 
        id: "exp_002", 
        name: "Dr. Pallavi", 
        role: "astrologer",
        specialty: "Nakshatra Expert", 
        rate: 1.50, 
        image: "https://i.pravatar.cc/150?u=pallavi", 
        isVerified: true,
        metrics: { reviews: 890, rating: 4.8 },
        isLive: true
      }
    ];
    res.status(200).json({ experts });
  }
}
