import { Router } from 'express';
import multer from 'multer';
import ArticleController from '../controllers/articleController.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/v1/articles — Create a new article as Draft
router.post('/', authenticate, upload.array('images'), ArticleController.create);

// PATCH /api/v1/articles/:id — Update an existing article
router.patch('/:id', authenticate, upload.array('images'), ArticleController.update);

export default router;
