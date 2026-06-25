// apps/api/src/app.ts

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health check — always available even if DB is down
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

// Mount user routes lazily so the health endpoint remains available
// even if the database isn't configured (e.g. CI without secrets).
export const appReady: Promise<void> = (async () => {
  try {
    const { default: userRouter } = await import('./routes/userRoutes.js');
    app.use('/api/users', userRouter);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.warn('User routes not mounted:', message);
  }
})();

export default app;