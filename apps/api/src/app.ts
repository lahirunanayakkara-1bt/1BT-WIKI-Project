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
    const [
      { default: userRouter },
      { default: adminRouter },
      { default: articlesRouter },
      { default: notificationsRouter },
    ] = await Promise.all([
      import('./routes/userRoutes.js'),
      import('./routes/adminRoutes.js'),
      import('./routes/articlesRoutes.js'),
      import('./routes/notificationsRoutes.js'),
    ]);

    // User routes  →  /api/v1/users
    app.use('/api/v1/users', userRouter);

    // Admin routes →  /api/v1/admin
    app.use('/api/v1/admin', adminRouter);

    // Articles routes → /api/v1/articles
    app.use('/api/v1/articles', articlesRouter);

    // Notifications routes → /api/v1/notifications
    app.use('/api/v1/notifications', notificationsRouter);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.warn('Routes not mounted:', message);
  }

  // ---------------------------------------------------------------------------
  // Global error handler — MUST be registered AFTER all routes.
  // Moved inside appReady so it sits last in the middleware stack regardless
  // of whether route loading is sync or async.
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
})();

export default app;