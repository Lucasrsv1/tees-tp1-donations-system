import { Router } from "express";
import v1 from "./v1";

const router = Router();

// ============= Geral ============= //

router.get("/", (_, res) => {
	res.json({ message: "Donations System" });
});

// ============= Versões ============= //

router.use("/v1", v1);

export default router;
