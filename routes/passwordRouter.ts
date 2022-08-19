import { Router } from "express";
import { resetPassword, setPassword } from "../controllers/passwordController";


export const passwordRouter = Router();

passwordRouter
  .post('/reset', resetPassword)

  .post('/set', setPassword)