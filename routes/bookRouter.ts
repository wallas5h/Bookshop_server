import { Router } from "express";
import { deleteBook, featureBooks, findBookById, getBooks, searchBooks, setBook, updateBook } from "../controllers";
import { authMiddleware } from "../middleware/authMiddleware";



export const bookRouter = Router();

bookRouter
  .get('/', getBooks)

  .get('/search/', searchBooks)

  .get('/feature', featureBooks)

  .get('/:id', findBookById)

  .post('/', setBook)

  .put('/:id', authMiddleware, updateBook)

  .delete('/:id', authMiddleware, deleteBook) 