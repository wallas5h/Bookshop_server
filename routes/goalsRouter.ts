import { Router } from "express";
import { deleteGoals, getGoals, setGoals, updateGoals } from "../controllers/goalController";


export const goalRouter = Router();

goalRouter
  .get('/', getGoals)

  .post('/:id', setGoals)

  .put('/:id', updateGoals)

  .delete('/:id', deleteGoals)