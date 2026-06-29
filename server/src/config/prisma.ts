import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});

/**
 * Single shared Prisma client for the whole server.
 * Creating a new PrismaClient() per request would open a new
 * database connection each time — expensive and unnecessary.
 */
const prisma = new PrismaClient({ adapter });

export default prisma;
