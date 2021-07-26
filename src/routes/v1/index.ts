import { Router } from "express";

import donationsRouter from "./donations";
import itemTypesRouter from "./itemsTypes";
import loginRouter from "./login";

import LoginController from "../../controllers/LoginController";

const router = Router();

// ============= Geral ============= //

router.get("/timestamp", LoginController.ensureAuthorized, (_, res) => {
	res.status(200).json({ timestamp: Date.now() });
});

// ============= Rotas ============= //

router.use(donationsRouter);
router.use(itemTypesRouter);
router.use(loginRouter);

export default router;
