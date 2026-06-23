import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

router.get('/getAll', UserController.getAll);
router.post('/', UserController.create);

export default router;
