import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Use test database URL
const testDatabaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error('DATABASE_URL_TEST or DATABASE_URL must be set for testing');
}

// Override DATABASE_URL for tests
process.env.DATABASE_URL = testDatabaseUrl;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterEach(async () => {
  // Clean up test data after each test (in reverse dependency order)
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;
  
  // Filter out system tables and migration tables
  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => !name.startsWith('_'));

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    } catch {
      // Table might not exist or be locked, continue
    }
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
