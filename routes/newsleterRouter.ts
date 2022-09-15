import { Router } from "express";
import { addUserToNewsletter, confirmNewsletter, removeUserFromNewsletter } from "../controllers/newsletterController";

export const newsletterRouter = Router();

newsletterRouter
  // .get('/:userId', getUserFromNewsletter)

  .get('/confirm/:id', confirmNewsletter)

  .post('/', addUserToNewsletter)

  .delete('/:id', removeUserFromNewsletter)