import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../config/prisma';
import { AuthResponse, JwtPayload } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

// ─── Register ───────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body as {
    email: string;
    password: string;
    name: string;
  };

  if (!email || !password || !name) {
    res.status(400).json({ message: 'email, password and name are required.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters.' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'An account with that email already exists.' });
    return;
  }

  // bcrypt.hash() is a one-way function — there is no bcrypt.unhash().
  // saltRounds=12 means the hash is computed 2^12=4096 times,
  // making brute-force attempts very slow.
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email, role: 'customer' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const body: AuthResponse = {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };

  res.status(201).json(body);
}

// ─── Login ──────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Compare the supplied password against the stored hash.
  // We always call bcrypt.compare even when no user is found (with a dummy
  // hash) to prevent timing attacks that could reveal whether an email exists.
  const dummyHash = '$2a$12$invalidhashusedtopreventimingtimingattack00000000000000';
  const isValid = await bcrypt.compare(password, user?.passwordHash ?? dummyHash);

  if (!user || !isValid) {
    // Same error message whether the email or password is wrong —
    // don't tell attackers which one failed.
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as 'customer' | 'admin',
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const body: AuthResponse = {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };

  res.json(body);
}

// ─── Me (get current user) ──────────────────────────────────────────────────

export async function getMe(req: Request, res: Response): Promise<void> {
  // req.user is set by the auth middleware (see middleware/auth.ts)
  const user = await prisma.user.findUnique({
    where: { id: (req as any).user.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  res.json(user);
}
