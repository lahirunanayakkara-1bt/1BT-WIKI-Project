import { Router } from 'express';
import multer from 'multer';
import ArticleController from '../controllers/articleController.js';
import commentsRoutes from './commentsRoutes.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/v1/articles — Create a new article as Draft
router.post('/', authenticate, upload.array('images'), ArticleController.create);

// PATCH /api/v1/articles/:id — Update an existing article
router.patch('/:id', authenticate, upload.array('images'), ArticleController.update);

// /api/v1/articles/:id/comments — Comments on an article
router.use('/:id/comments', commentsRoutes);

export default router;
