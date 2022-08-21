import { Router } from "express";
import {
  addBookToCart,
  changeCartStatus,
  decreaseCountBookInCart,
  deleteBookFromCart,
  getBooksFromCart,
} from "../controllers/cartController";

export const cartRouter = Router();

cartRouter
  .get("/", getBooksFromCart)

  .post("/:bookId", addBookToCart)

  .put("/:bookId", decreaseCountBookInCart)

  .delete("/:bookId", deleteBookFromCart)

  .put("/change/status/:cartId", changeCartStatus);
