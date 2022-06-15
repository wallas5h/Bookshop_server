import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers";
import { authMiddleware } from "../middleware/authMiddleware";


export const userRouter = Router();

userRouter
  .post('/', registerUser)

  .post('/login', loginUser)

  .get('/me', authMiddleware, getMe)
