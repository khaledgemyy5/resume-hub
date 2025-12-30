/**
 * API Entry Point
 * Express server with security middleware, routes, and error handling
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { authRouter, publicRouter, adminRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';
import prisma from './lib/prisma.js';

// Environment configuration
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

// ============= Security Middleware =============

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: IS_PRODUCTION,
  crossOriginEmbedderPolicy: false,
}));

// CORS with strict origin
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Cookie parser for httpOnly cookies
app.use(cookieParser());

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));

// ============= Rate Limiting =============

// General rate limit
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for analytics events
const eventsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 events per minute
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many events' } },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ============= Health Check =============

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// ============= Routes =============

// Auth routes with strict rate limiting
app.use('/auth', authLimiter, authRouter);

// Public routes
app.use('/public', publicRouter);

// Events endpoint with specific rate limit
app.post('/public/events', eventsLimiter);

// Admin routes (auth + CSRF handled in router)
app.use('/admin', adminRouter);

// API info
app.get('/api', (_req, res) => {
  res.json({
    message: 'Ammar Resume API',
    version: '1.0.0',
    environment: IS_PRODUCTION ? 'production' : 'development',
  });
});

// ============= Error Handling =============

app.use(notFoundHandler);
app.use(errorHandler);

// ============= Graceful Shutdown =============

async function shutdown(): Promise<void> {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ============= Start Server =============

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${IS_PRODUCTION ? 'production' : 'development'}`);
  console.log(`   CORS origin: ${CORS_ORIGIN}`);
});

export default app;
