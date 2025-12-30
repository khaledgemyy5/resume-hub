import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { loginCredentialsSchema } from '@ammar-resume/shared';
import prisma from '../lib/prisma.js';
import { hashPassword, verifyPassword, checkPasswordStrength } from '../lib/password.js';
import { signToken, getTokenExpiryMs } from '../lib/jwt.js';
import { validateBody, ApiError } from '../middleware/index.js';
import { setCsrfCookie } from '../middleware/csrf.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const AUTH_COOKIE_NAME = 'auth_token';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Cookie options for auth token
const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'strict' as const,
  maxAge: getTokenExpiryMs(),
  path: '/',
};

/**
 * POST /auth/login
 * Login with email and password
 */
router.post(
  '/login',
  validateBody(loginCredentialsSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    
    // Generate JWT
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    
    // Set auth cookie
    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
    
    // Set CSRF cookie for subsequent requests
    setCsrfCookie(res);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  }
);

/**
 * POST /auth/logout
 * Clear auth cookies
 */
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
  res.clearCookie('csrf_token', { path: '/' });
  
  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.adminUser.findUnique({
    where: { id: req.user!.sub },
    select: { id: true, email: true, name: true },
  });
  
  if (!user) {
    throw new ApiError(401, 'USER_NOT_FOUND', 'User no longer exists');
  }
  
  res.json({
    success: true,
    data: { user },
  });
});

/**
 * POST /auth/change-password
 * Change password for authenticated user
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12).max(128),
});

router.post(
  '/change-password',
  requireAuth,
  validateBody(changePasswordSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;
    
    // Check password strength
    const strengthError = checkPasswordStrength(newPassword);
    if (strengthError) {
      throw new ApiError(400, 'WEAK_PASSWORD', strengthError);
    }
    
    // Get user
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user!.sub },
    });
    
    if (!user) {
      throw new ApiError(401, 'USER_NOT_FOUND', 'User not found');
    }
    
    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
    }
    
    // Hash new password
    const newHash = await hashPassword(newPassword);
    
    // Update password
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });
    
    res.json({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  }
);

export default router;
