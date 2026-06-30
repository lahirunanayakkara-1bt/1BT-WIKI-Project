import type { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService.js';
import { successResponse } from '../types/userTypes.js';
import type { UserRole } from '../types/userTypes.js';

// ---------------------------------------------------------------------------
// GET /api/v1/users
// ---------------------------------------------------------------------------

/** List all users in the system. */
const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserService.getAll();
    res.status(200).json(successResponse(users));
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// POST /api/v1/admin/users  (Admin only)
// ---------------------------------------------------------------------------

/**
 * Admin: onboard a new user into the system.
 *
 * Expected body:
 * {
 *   "name":  "string"             — required
 *   "email": "string"             — required
 *   "role":  "Admin|Reviewer|User" — optional, defaults to "User"
 *   "image": "string (URL)"       — optional
 * }
 */
const adminCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      role,
      image,
    } = req.body as {
      name: unknown;
      email: unknown;
      role: unknown;
      image: unknown;
    };

    const newUser = await UserService.adminCreateUser({
      name:  String(name  ?? ''),
      email: String(email ?? ''),
      role:  role  ? (String(role)  as UserRole) : undefined,
      image: image ? String(image) : undefined,
    });

    res.status(201).json(successResponse(newUser, 'User created successfully'));
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body as { role: unknown };

    const updatedUser = await UserService.updateUserRole(userId, role as UserRole);
    res.status(200).json(successResponse(updatedUser, 'User role updated successfully'));
  } catch (error) {
    next(error);
  }
};

const updateUserBanStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { banned, banReason } = req.body as {
      banned: unknown;
      banReason: unknown;
    };

    const updatedUser = await UserService.updateUserBanStatus(userId, {
      banned: Boolean(banned),
      banReason: banReason != null ? String(banReason) : undefined,
    });

    const message = banned ? 'User deactivated successfully' : 'User reactivated successfully';
    res.status(200).json(successResponse(updatedUser, message));
  } catch (error) {
    next(error);
  }
};

export default { getAll, adminCreateUser, updateUserRole, updateUserBanStatus };
