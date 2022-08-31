import { Router } from "express";
import {
  changesAfterPayment,
  createCheckoutSession,
} from "../controllers/checkoutController";

export const checkoutRouter = Router();

checkoutRouter
  .post("/create-checkout-session", createCheckoutSession)

  .put("/checkout-success/:cartId", changesAfterPayment);
