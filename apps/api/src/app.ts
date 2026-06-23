import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

// Mount user routes lazily so the health endpoint remains available
// even if the database isn't configured (e.g. CI without secrets).
(async () => {
  try {
    const userRouterModule = await import('./routes/userRoutes.js');
    const userControllerModule = await import('./controllers/userController.js');
    const userRouter = userRouterModule.default;
    const UserController = userControllerModule.default;

    app.use('/api/users', userRouter);
    userRouter.get('/getAll', UserController.getAll);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('User routes not mounted:', err?.message ?? err);
  }
})();

export default app;
