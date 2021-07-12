import { Router } from "express";

import LoginController from "../../controllers/LoginController";
import UserController from "../../controllers/UserController";

const router = Router();

router.get("/users/allUsers", LoginController.ensureAuthorized, UserController.getAllUsers);
router.get("/users/:idUser", LoginController.ensureAuthorized, UserController.getOneUserById);

router.put("/users/:idUser", LoginController.ensureAuthorized, UserController.updateUser);

router.delete("/users/:idUser", LoginController.ensureAuthorized, UserController.deleteUser);

export default router;
