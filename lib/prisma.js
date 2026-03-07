import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

const dbUrl = process.env.DATABASE_URL || '';
// Mask password for logging
const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
console.log('DATABASE_URL:', maskedUrl);

let prisma = globalForPrisma.prisma;

if (!prisma) {
  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
}

export default prisma;