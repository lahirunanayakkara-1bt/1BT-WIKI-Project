import { Router } from 'express';
import CommentController from '../controllers/commentController.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

// POST /api/v1/articles/:id/comments — Add a comment to a published article
router.post('/', authenticate, CommentController.create);

// GET /api/v1/articles/:id/comments — List comments on a published article (or, for its own author, a non-Published article)
router.get('/', authenticate, CommentController.list);

// PATCH /api/v1/articles/:id/comments/:commentId — Edit own comment
router.patch('/:commentId', authenticate, CommentController.update);

// DELETE /api/v1/articles/:id/comments/:commentId — Delete own comment
router.delete('/:commentId', authenticate, CommentController.remove);

export default router;
