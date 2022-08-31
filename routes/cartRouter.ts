import { Router } from "express";
import {
  addBookToCart,
  changeCartStatus,
  decreaseCountBookInCart,
  deleteBookFromCart,
  getBooksFromCart,
  getBooksFromCartForCheckout,
} from "../controllers/cartController";

export const cartRouter = Router();

cartRouter
  .get("/", getBooksFromCart)

  .get("/checkout", getBooksFromCartForCheckout)

  .post("/:bookId", addBookToCart)

  .put("/:bookId", decreaseCountBookInCart)

  .delete("/:bookId", deleteBookFromCart)

  .put("/change/status/:cartId", changeCartStatus);
