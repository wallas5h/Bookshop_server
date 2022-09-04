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
import { authMiddleware } from "../middleware/authMiddleware";

export const bookRouter = Router();

bookRouter
  .get("/", getBooks)

  .get("/search/", searchBooks)

  .get("/feature", featureBooks)

  .get("/:id", findBookById)

  .post("/", adminAuthMiddleware, setBook)

  .put("/:id", authMiddleware, updateBook)

  .delete("/:id", authMiddleware, deleteBook);
