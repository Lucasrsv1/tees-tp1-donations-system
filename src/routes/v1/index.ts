import { Router } from "express";
import userRoute from "./usersRoute";
import signUpRoute from "./signUpRoute";
import loginRoute from "./loginRoute";

const router = Router();

// ============= Geral ============= //

router.get("/timestamp", (_, res) => {
	res.status(200).json({ timestamp: Date.now() });
});

router.use(signUpRoute);
router.use(loginRoute);
router.use(userRoute);

export default router;
