import { Router } from "express";
import { postNovaTransacao, getHome } from "../controllers/transactions.controller.js";

const transactionsRouter = Router();

transactionsRouter.post("/nova-transacao/:tipo", postNovaTransacao)

transactionsRouter.get("/home", getHome)

export default transactionsRouter;