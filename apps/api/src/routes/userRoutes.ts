import { Router } from 'express';
import UserController from '../controllers/userController.js';
import ProfileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/getAll', UserController.getAll);
router.get('/me', authenticate, ProfileController.getOwnProfile);

export default router;
