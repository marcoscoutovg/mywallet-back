import { Router } from "express";
import { postCadastro, postLogin } from "../controllers/user.controller.js";

const usersRouter = Router();

usersRouter.post("/cadastro", postCadastro)

usersRouter.post("/", postLogin)

export default usersRouter;