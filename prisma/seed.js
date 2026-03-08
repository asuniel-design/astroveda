import { PrismaClient } from '@prisma/client';

// Simple initialization: Prisma will automatically look for 
// DATABASE_URL in the environment provided by Railway.
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sovereign ESM Seed Sequence...');
  
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
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
