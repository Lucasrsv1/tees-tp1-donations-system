import { Router } from "express";
import UserController from '../../controllers/UserController';

const router = Router();

router.get('/users/allUsers', UserController.getAllUsers);
router.get('/users/:idUser', UserController.getOneUserById);

router.put('/users/:idUser', UserController.updateUser);

router.delete('/users/:idUser', UserController.deleteUser);

export default router;
