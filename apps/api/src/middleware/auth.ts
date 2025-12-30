import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JWTPayload } from '../lib/jwt.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Middleware to require admin authentication
 * Reads JWT from httpOnly cookie
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
    return;
  }
  
  req.user = payload;
  next();
}

/**
 * Optional auth - attaches user if token present but doesn't require it
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  
  next();
}
