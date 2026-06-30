// apps/api/src/app.ts

import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errors/AppError.js';
import { errorResponse } from './types/userTypes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check — always available even if DB is down
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

export const appReady: Promise<void> = (async () => {
  try {
    const [{ default: userRouter }, { default: adminRouter }] =
      await Promise.all([
        import('./routes/userRoutes.js'),
        import('./routes/adminRoutes.js'),
      ]);

    // User routes  →  /api/v1/users
    app.use('/api/v1/users', userRouter);

    // Admin routes →  /api/v1/admin
    app.use('/api/v1/admin', adminRouter);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.warn('Routes not mounted:', message);
  }
})();

// ---------------------------------------------------------------------------
// Global error handler — must be registered AFTER all routes
// Handles AppError (domain errors) and unexpected errors uniformly.
// ---------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json(errorResponse('Internal server error'));
});

export default app;