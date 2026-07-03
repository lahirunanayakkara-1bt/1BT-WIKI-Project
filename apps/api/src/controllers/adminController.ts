import type { Request, Response, NextFunction } from 'express';
import adminService from '../services/adminService.js';
import { successResponse } from '../types/userTypes.js';

// ---------------------------------------------------------------------------
// GET /api/v1/users
// ---------------------------------------------------------------------------

/** List all users in the system. */
const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(successResponse(users));
  } catch (error) {
    next(error);
  }
};

export default { getAllUsers };
