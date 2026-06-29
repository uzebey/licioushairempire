import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler. Express recognizes this as an error handler
 * because it has 4 parameters. Keeping error details out of the response
 * (and only logging them server-side) prevents leaking internals
 * (stack traces, file paths, library versions) to attackers.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
}
