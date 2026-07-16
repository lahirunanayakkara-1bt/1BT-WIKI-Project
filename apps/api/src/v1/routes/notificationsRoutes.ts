// apps/api/src/routes/notificationsRoutes.ts
//
// Mounted at: /api/v1/notifications  (see app.ts)

import { Router } from 'express';
import NotificationController from '../controllers/notificationController.js';
// authenticate is Lahiru's middleware (src/middleware/auth.middleware.ts).
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// GET /api/v1/notifications — list authenticated user's notifications (NO-02)
router.get('/', authenticate, NotificationController.getNotifications);

router.patch('/:id/read', authenticate, NotificationController.markNotificationAsRead);

export default router;
