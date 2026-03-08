const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = "postgresql://neondb_owner:npg_8PFjli6tHrRQ@ep-wispy-queen-aimj798b-pooler.c-4.us-east-1.aws.neon.tech/neondb";

// NeonDB strictly requires SSL for all external driver connections
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const experts = [
    {
      name: 'Dr. Alisha Rao',
      specialty: 'Vedic Astrology',
      experienceYears: 15,
      baseRateINR: 45,
      bio: 'Specializing in career trajectories and relationship compatibility.',
      isOnline: true,
    },
    {
      name: 'Marcus Vance',
      specialty: 'Tarot & Ephemeris',
      experienceYears: 10,
      baseRateINR: 55,
      bio: 'Combining Swiss Ephemeris data with intuitive modern readings.',
      isOnline: true,
    },
    {
      name: 'Siddharth Varma',
      specialty: 'Nadi Astrology',
      experienceYears: 20,
      baseRateINR: 65,
      bio: 'Expert in Nadi leaf readings and ancestral karma clearing.',
      isOnline: false,
    },
    {
      name: 'Priya Nair',
      specialty: 'Vastu Shastra',
      experienceYears: 8,
      baseRateINR: 40,
      bio: 'Aligning modern living spaces with ancient cosmic geometry.',
      isOnline: true,
    },
  ];

  console.log('Connecting via Secure Driver Adapter to NeonDB...');
  
  await prisma.astrologer.deleteMany({});

  for (const expert of experts) {
    await prisma.astrologer.create({
      data: expert,
    });
  }
  console.log('Seeding complete! 🚀');
}

main()
  .catch((e) => {
    console.error('Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
