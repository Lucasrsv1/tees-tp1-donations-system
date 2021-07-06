import { Router } from "express";

const router = Router();

// ============= Geral ============= //

router.get("/timestamp", (_, res) => {
	res.status(200).json({ timestamp: Date.now() });
});

export default router;
