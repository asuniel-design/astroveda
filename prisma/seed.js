import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting AstroVeda Connect Seed Sequence...');
  
  // 1. Seed Identity (B2B Partner)
  const partner = await prisma.identity.upsert({
    where: { email: 'niel@astroveda.io' },
    update: {},
    create: {
      email: 'niel@astroveda.io',
      star: 'Rohini',
      place: 'Fort Worth',
      status: 'FULFILLED',
      apiKeys: {
        create: {
          key: 'ak_live_9fc8130a7fd3f183daa916b43db8fb7e42c4477c62a1670ad263389ad7554a38',
          tier: 'SOVEREIGN_ELITE'
        }
      }
    },
  });
  console.log('✅ B2B Vault Seeded Successfully: ' + partner.email);

  // 2. Seed Astrologers
  const astrologers = [
    {
      id: '3f0e0a67-1acb-40d8-8b85-4ccc254bbf46',
      name: 'Pandit Sharma',
      bio: 'Vedic astrology expert with 15+ years of experience. Specializes in career and relationship readings using traditional Parashari techniques.',
      avatar_url: 'https://i.pravatar.cc/150?u=pandit',
      expertise: ['Vedic', 'KP', 'Career'],
      languages: ['Hindi', 'English', 'Sanskrit'],
      experience_years: 15,
      price_per_minute: 45, // INR per minute
      price_per_chat_minute: 40,
      price_per_call_minute: 50,
      price_per_video_minute: 60,
      is_online: true,
      is_busy: false,
      status: 'ONLINE',
      is_verified: true,
      rating: 4.9,
      total_ratings: 1240,
      response_time_avg: 45,
      completion_rate: 98.5,
    },
    {
      id: '001619c1-0afc-4af1-8063-38607c6c7604',
      name: 'Jyotish Patel',
      bio: 'Nakshatra and Muhurta specialist. Combines Swiss Ephemeris data with intuitive readings from a serene, modern perspective.',
      avatar_url: 'https://i.pravatar.cc/150?u=jyotish',
      expertise: ['Nakshatra', 'Muhurta', 'Numerology'],
      languages: ['Gujarati', 'English', 'Hindi'],
      experience_years: 12,
      price_per_minute: 55,
      price_per_chat_minute: 50,
      price_per_call_minute: 60,
      price_per_video_minute: 70,
      is_online: true,
      is_busy: false,
      status: 'ONLINE',
      is_verified: true,
      rating: 4.8,
      total_ratings: 890,
      response_time_avg: 60,
      completion_rate: 97.2,
    },
    {
      id: 'ee6070d8-8d2a-4060-9fe7-46791f321ac6',
      name: 'Acharya Gupta',
      bio: 'Expert in Vastu and Gemology. Provides holistic guidance combining astrology with practical remedies.',
      avatar_url: 'https://i.pravatar.cc/150?u=acharya',
      expertise: ['Vastu', 'Gemology', 'Remedies'],
      languages: ['Hindi', 'English', 'Bengali'],
      experience_years: 20,
      price_per_minute: 65,
      price_per_chat_minute: 60,
      price_per_call_minute: 70,
      price_per_video_minute: 80,
      is_online: false,
      is_busy: false,
      status: 'OFFLINE',
      is_verified: true,
      rating: 4.95,
      total_ratings: 2100,
      response_time_avg: 30,
      completion_rate: 99.1,
    },
  ];

  for (const data of astrologers) {
    const astrologer = await prisma.astrologer.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
    console.log(`✅ Astrologer seeded: ${astrologer.name}`);
  }

  // 3. Seed Services (skipped - models not defined)
  console.log('⏭️  Services seeding skipped (models not defined)');

  // 4. Seed Banner (skipped)
  console.log('⏭️  Banner seeding skipped');

  // 5. Seed Testimonials (skipped)
  console.log('⏭️  Testimonials seeding skipped');

  console.log('🎉 Astrologer seed data completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
