/**
 * adminRoutes.ts — Admin-scoped routes.
 *
 * Mounted at: /api/v1/admin  (see app.ts)
 *
 * TODO: Add `authenticate` + `requireRole('Admin')` middleware here
 *       once Lahiru's auth middleware is available.
 */

import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

// POST /api/v1/admin/users — Admin: onboard a new user
router.post('/users', UserController.adminCreateUser);

// PATCH /api/v1/admin/users/:userId/role — Admin: update a user's role
router.patch('/users/:userId/role', UserController.updateUserRole);

// PATCH /api/v1/admin/users/:userId/ban — Admin: deactivate/reactivate a user
router.patch('/users/:userId/ban', UserController.updateUserBanStatus);

export default router;
