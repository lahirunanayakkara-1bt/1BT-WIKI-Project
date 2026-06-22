import { Request, Response } from 'express';
import UserService from '../services/userService.js';

const getAll = async (_req: Request, res: Response) => {
  const users = await UserService.getAll();
  res.json(users);
};

const create = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await UserService.create(payload);
  res.status(201).json(user);
};

export default { getAll, create };
