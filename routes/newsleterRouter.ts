import { Router } from "express";
import { addUserToNewsletter, removeUserFromNewsletter } from "../controllers/newsletterController";

export const newsletterRouter = Router();

newsletterRouter
  // .get('/:userId', getUserFromNewsletter)

  .post('/', addUserToNewsletter)

  .delete('/:id', removeUserFromNewsletter)