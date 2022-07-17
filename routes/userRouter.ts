import { Router } from "express";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers";
import { authMiddleware } from "../middleware/authMiddleware";


export const userRouter = Router();

userRouter
  .post('/', registerUser)

  .post('/login', loginUser)

  .get('/logout', logoutUser)

  .get('/me', authMiddleware, getMe)
