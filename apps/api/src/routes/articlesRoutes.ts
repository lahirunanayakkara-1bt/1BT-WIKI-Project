import { Router } from 'express';
import multer from 'multer';
import ArticleController from '../controllers/articleController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/v1/articles — Create a new article as Draft
router.post('/', authenticate, upload.array('images'), ArticleController.create);

export default router;
