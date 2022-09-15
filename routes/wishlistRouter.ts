import { Router } from "express";
import { addBookToWishlist, deleteBookFromWishlist, getBooksFromWishlist } from "../controllers/wishlistController";




export const wishlistRouter = Router();

wishlistRouter
  .get('/', getBooksFromWishlist)

  .post('/:bookId', addBookToWishlist)

  // .put('/:bookId', decreaseCountBookInWishlist)

  .delete('/:bookId', deleteBookFromWishlist)