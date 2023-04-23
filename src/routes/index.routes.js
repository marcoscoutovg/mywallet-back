import { Router } from "express";
import transactionsRouter from "./transactions.routes.js";
import usersRouter from "./users.routes.js";

const router = Router()

router.use(transactionsRouter);
router.use(usersRouter);

export default router;