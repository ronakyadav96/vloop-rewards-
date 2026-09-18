import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dailyStreakRoutes from './routes/dailyStreakRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import { DomainError } from './utils/errors.js';

export function createApp() {
  const app = express();
  const allowedOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

  app.use(
    cors({
      // An unset allow-list must not silently become a production-wide wildcard.
      origin: allowedOrigins.length ? allowedOrigins : false,
    })
  );
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/streak', streakRoutes);
  app.use('/api/daily-streak', dailyStreakRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_JSON', message: 'The request body must contain valid JSON' },
      });
    }

    if (error instanceof DomainError) {
      if (error.status >= 500) console.error(`${error.code}: ${error.message}`);
      return res.status(error.status).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      });
    }

    console.error(error);

    if (error?.name === 'ValidationError') {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'The request could not be processed' },
      });
    }

    if (error?.code === 20 || error?.codeName === 'IllegalOperation' || error?.message?.includes('Transaction numbers are only allowed')) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_TRANSACTION_REQUIRED',
          message: 'Daily streak claims require MongoDB transactions; use a replica set deployment',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
    });
  });

  return app;
}
