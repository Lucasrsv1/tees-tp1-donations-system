import { Router } from "express";

import loginRoute from "./login";
import userRoute from "./users";

import LoginController from "../../controllers/LoginController";

const router = Router();

// ============= Geral ============= //

router.get("/timestamp", LoginController.ensureAuthorized, (_, res) => {
	res.status(200).json({ timestamp: Date.now() });
});

// ============= Rotas ============= //

router.use(loginRoute);
router.use(userRoute);

export default router;
