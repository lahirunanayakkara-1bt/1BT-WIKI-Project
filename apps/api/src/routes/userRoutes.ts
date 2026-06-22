import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.getAll);
router.post('/', UserController.create);

export default router;
