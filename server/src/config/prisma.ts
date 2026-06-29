import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';
import ws from 'ws';

// ws polyfill required in Node.js — Vercel edge has WebSocket built-in
neonConfig.webSocketConstructor = ws;

// PrismaNeon is a factory in Prisma v7: pass PoolConfig, it creates the Pool
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default prisma;
