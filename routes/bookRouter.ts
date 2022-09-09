import { Router } from "express";
import {
  deleteBook,
  featureBooks,
  findBookById,
  getBooks,
  searchBooks,
  setBook,
  updateBook,
} from "../controllers";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

export const bookRouter = Router();

bookRouter
  .get("/", getBooks)

  .get("/search/", searchBooks)

  .get("/feature", featureBooks)

  .get("/:id", findBookById)

  .post("/", adminAuthMiddleware, setBook)

  .put("/:id", adminAuthMiddleware, updateBook)

  .delete("/:id", adminAuthMiddleware, deleteBook);
