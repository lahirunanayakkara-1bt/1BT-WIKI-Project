import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { ReviewerController } from '../controllers/reviewerController.js';

const router = Router();
const reviewerController = new ReviewerController();
const { listPending, approveArticle } = reviewerController;

router.get('/articles/pending', authenticate, requireRole('Reviewer'), listPending);
router.patch('/articles/:id/approve', authenticate, requireRole('Reviewer', 'Admin'), approveArticle);

export default router;
