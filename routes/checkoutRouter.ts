import { Router } from "express";
import { createCheckoutSession } from "../controllers/checkoutController";


export const checkoutRouter = Router();

checkoutRouter
  .post('/create-checkout-session', createCheckoutSession)