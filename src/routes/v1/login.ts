import { Router } from "express";

import LoginController from "../../controllers/LoginController";
import UserController from "../../controllers/UserController";

const router = Router();

router.post("/login", LoginController.loginValidations, LoginController.login);

router.post("/signUp", UserController.createUser);

export default router;
