import { Router } from 'express';
import multer from 'multer';
import { ArticleController } from '../controllers/articleController.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const articleController = new ArticleController();

// POST /api/v1/articles — Create a new article as Draft
router.post('/', authenticate, upload.array('images'), articleController.create);

// GET /api/v1/articles — List published articles
router.get('/', authenticate, articleController.listPublished);

// GET /api/v1/articles/:id — View a single published article
router.get('/:id', authenticate, articleController.getById);

// PATCH /api/v1/articles/:id — Update an existing article
router.patch('/:id', authenticate, upload.array('images'), articleController.update);

// POST /api/v1/articles/:id/submit — Submit article for review (Draft -> Pending)
router.post('/:id/submit', authenticate, articleController.submitForReview);

export default router;

