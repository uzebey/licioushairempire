import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

// Extend Express's Request type to include our decoded user payload.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware that checks for a valid JWT in the Authorization header.
 * Usage in routes: router.get('/protected', requireAuth, controller)
 *
 * The browser sends: Authorization: Bearer <token>
 * We verify the token, decode the payload, and attach it to req.user
 * so any controller further down the chain can use it.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided.' });
    return;
  }

  const token = authHeader.slice(7); // remove "Bearer " prefix

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next(); // pass control to the next function (the actual controller)
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required.' });
    return;
  }
  next();
}
