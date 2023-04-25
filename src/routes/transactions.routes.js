import { Router } from "express";
import { postNovaTransacao, getHome } from "../controllers/transactions.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { operationSchema } from "../schemas/transactions.schemas.js"

const transactionsRouter = Router();


transactionsRouter.post("/nova-transacao/:tipo", validateSchema(operationSchema), postNovaTransacao)

transactionsRouter.get("/home", getHome)

export default transactionsRouter;