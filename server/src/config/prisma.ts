import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

// The adapter resolves the file path relative to process.cwd(),
// which is the server/ folder when you run `npm run dev`.
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });

/**
 * Single shared Prisma client for the whole server.
 * Creating a new PrismaClient() per request would open a new
 * database connection each time — expensive and unnecessary.
 */
const prisma = new PrismaClient({ adapter });

export default prisma;
