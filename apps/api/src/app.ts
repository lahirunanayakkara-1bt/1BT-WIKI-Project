import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import UserController from './controllers/userController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api/users', userRouter);

userRouter.get('/getAll', UserController.getAll);

export default app;
