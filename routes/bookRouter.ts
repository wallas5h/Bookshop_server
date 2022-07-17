import { Router } from "express";
import { deleteBook, getBooks, setBook, updateBook } from "../controllers";
import { authMiddleware } from "../middleware/authMiddleware";



export const bookRouter = Router();

bookRouter
  .get('/', getBooks)

  .post('/', setBook)

  .put('/:id', authMiddleware, updateBook)

  .delete('/:id', authMiddleware, deleteBook) 