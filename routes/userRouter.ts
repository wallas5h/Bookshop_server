import { Router } from "express";
import { confirmRegistration, getMe, loginUser, logoutUser, registerUser, resendRegisterVerification } from "../controllers";


export const userRouter = Router();

userRouter
  .post('/', registerUser)

  .post('/login', loginUser)

  .get('/logout', logoutUser)

  .get('/confirm/:id', confirmRegistration)

  .post('/resendRegisterVerification', resendRegisterVerification)

  .get('/me', getMe)
  // .get('/me', authMiddleware, getMe)
