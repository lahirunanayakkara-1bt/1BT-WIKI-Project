import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import UserController from './controllers/userController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

userRouter.get('/getAll', UserController.getAll);

export default app;
