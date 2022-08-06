import { Router } from "express";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers";


export const userRouter = Router();

userRouter
  .post('/', registerUser)

  .post('/login', loginUser)

  .get('/logout', logoutUser)

  .get('/me', getMe)
  // .get('/me', authMiddleware, getMe)
