import { Router } from 'express';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import articlesRoutes from './articlesRoutes.js';
import notificationsRoutes from './notificationsRoutes.js';

const router = Router();
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/articles', articlesRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
