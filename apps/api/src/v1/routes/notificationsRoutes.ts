// apps/api/src/routes/notificationsRoutes.ts
//
// Mounted at: /api/v1/notifications  (see app.ts)

import { Router } from 'express';
import NotificationController from '@controllers/notificationController.js';
// authenticate is Lahiru's middleware (src/middleware/auth.middleware.ts).
import { authenticate } from '@/middleware/auth.middleware.js';

const router = Router();

// POST /api/v1/notifications/test — helper route for development/testing
router.post('/test', authenticate, NotificationController.testNotification);

// GET /api/v1/notifications — list authenticated user's notifications (NO-02)
router.get('/', authenticate, NotificationController.getNotifications);

// GET /api/v1/notifications/unread-count — unread badge count
// IMPORTANT: must be registered before /:id routes to avoid Express treating
// the literal string "unread-count" as an :id parameter.
router.get('/unread-count', authenticate, NotificationController.getUnreadCount);

router.patch('/:id/read', authenticate, NotificationController.markNotificationAsRead);

export default router;
