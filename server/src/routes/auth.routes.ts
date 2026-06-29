import { Router } from 'express';

import { register, login, getMe } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/auth/register  — create a new account
router.post('/register', register);

// POST /api/auth/login     — returns a JWT
router.post('/login', login);

// GET  /api/auth/me        — returns the logged-in user (token required)
router.get('/me', requireAuth, getMe);

export default router;
