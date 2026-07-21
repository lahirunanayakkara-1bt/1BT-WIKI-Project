import { Router } from 'express';
import multer from 'multer';
import { ArticleController } from '../controllers/articleController.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const articleController = new ArticleController();
const { create, listPublished, getById, update, submitForReview } = articleController;

// POST /api/v1/articles — Create a new article as Draft
router.post('/', authenticate, upload.array('images'), create);

// GET /api/v1/articles — List published articles
router.get('/', authenticate, listPublished);

// GET /api/v1/articles/:id — View a single published article
router.get('/:id', authenticate, getById);

// PATCH /api/v1/articles/:id — Update an existing article
router.patch('/:id', authenticate, upload.array('images'), update);

// POST /api/v1/articles/:id/submit — Submit article for review (Draft -> Pending)
router.post('/:id/submit', authenticate, submitForReview);

export default router;

