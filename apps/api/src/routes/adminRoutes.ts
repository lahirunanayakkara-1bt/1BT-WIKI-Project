/**
 * adminRoutes.ts — Admin-scoped routes.
 *
 * Mounted at: /api/v1/admin  (see app.ts)
 *
 * All routes require:
 *   1. authenticate  — valid session (A-01)
 *   2. requireRole('Admin') — caller must hold the Admin role (A-02)
 */

import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

// POST /api/v1/admin/users — Admin: onboard a new user
router.post('/users', authenticate, requireRole('Admin'), UserController.adminCreateUser);

// PATCH /api/v1/admin/users/:userId/role — Admin: update a user's role
router.patch('/users/:userId/role', authenticate, requireRole('Admin'), UserController.updateUserRole);

// PATCH /api/v1/admin/users/:userId/ban — Admin: deactivate/reactivate a user
router.patch('/users/:userId/ban', authenticate, requireRole('Admin'), UserController.updateUserBanStatus);

export default router;
