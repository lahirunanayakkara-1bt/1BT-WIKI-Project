import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

app.get('/', (_req, res) => res.json({ status: 'ok' }));

export default app;
