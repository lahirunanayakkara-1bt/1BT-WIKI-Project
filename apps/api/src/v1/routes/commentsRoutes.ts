import { Router } from 'express';
import CommentController from '../controllers/commentController.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

// POST /api/v1/articles/:id/comments — Add a comment to a published article
router.post('/', authenticate, CommentController.create);

export default router;
