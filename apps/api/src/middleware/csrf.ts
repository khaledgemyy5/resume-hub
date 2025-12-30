import type { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Middleware to set CSRF cookie on responses
 * Should be used on auth endpoints to set initial CSRF token
 */
export function setCsrfCookie(res: Response): string {
  const token = generateCsrfToken();
  
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JS for double-submit
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  return token;
}

/**
 * Middleware to verify CSRF token on state-changing requests
 * Uses double-submit cookie pattern
 */
export function verifyCsrf(req: Request, res: Response, next: NextFunction): void {
  // Only verify on state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;
  
  if (!cookieToken || !headerToken) {
    res.status(403).json({
      success: false,
      error: { code: 'CSRF_MISSING', message: 'CSRF token missing' },
    });
    return;
  }
  
  // Constant-time comparison would be ideal, but tokens are random so timing attacks are impractical
  if (cookieToken !== headerToken) {
    res.status(403).json({
      success: false,
      error: { code: 'CSRF_INVALID', message: 'CSRF token invalid' },
    });
    return;
  }
  
  next();
}
