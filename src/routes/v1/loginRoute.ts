import { Router } from "express";
import UserController from '../../controllers/UserController';

const router = Router();

router.get('/login', UserController.getOneUserByLogin);

export default router;
