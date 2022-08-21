import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { User } from "../models";
import { Book } from "../models/bookModel";
import { Cart } from "../models/cartModel";
import { Guest } from "../models/guestModel";
import { GuestEntity, UserEntity } from "../types";
import { verifyToken } from "../utils/logs";

// @desc get cart
// @route get /api/cart
// @acces Pivate

export const getBooksFromCart = async (req, res) => {
  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guest: GuestEntity | null = null;

  const jwtCookie: string | undefined = req.cookies.jwt;
  let guestId: string | null = req.cookies.guest;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  let cart = await findOneCart(userId, guestId);

  if (!cart) {
    res.status(200).json({
      cartId: "",
      books: [],
      totalCost: 0,
    });
    return;
  }

  const totalCost = cart.books
    .map((book) => book.count * book.price)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);

  res.status(200).json({
    cartId: cart._id,
    books: cart.books,
    totalCost,
  });
};

// @desc post cart
// @route post /api/cart/:userToken/:bookId'
// @acces Pivate

export const addBookToCart = async (req, res) => {
  const bookId = req.params.bookId;
  let guestId: string | null = req.cookies.guest;

  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guest: GuestEntity | null = null;

  const jwtCookie: string | undefined = req.cookies.jwt;

  let bookAvailability: Boolean = true;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  guestId = user ? "" : guestId; // gdy user true, czyszczę guestId -> cookie guest

  if (!user && !guestId) {
    guest = await Guest.create({
      name: `guest-${uuid()}`,
    });
    guestId = guest._id;
  }

  let cart = await findOneCart(userId, guestId);

  const book = await Book.findOne({
    _id: bookId,
  });

  if (!book) {
    res.status(400).json({
      message: "Invalid book Id",
    });
  }

  if (!book.count) {
    bookAvailability = false;
  }

  if (!bookAvailability) {
    res.status(400).json({
      message: "Book out of store. Please try later.",
    });
    return;
  }

  if (!cart && user) {
    cart = await Cart.create({
      user: userId,
      guest: "",
      books: [
        {
          bookId,
          title: book.title,
          count: 1,
          price: book.newPrice,
          availability: bookAvailability,
        },
      ],
      active: true,
    });
  } else if (!cart && guestId) {
    cart = await Cart.create({
      user: "",
      guest: guestId,
      books: [
        {
          bookId,
          title: book.title,
          count: 1,
          price: book.newPrice,
          availability: bookAvailability,
        },
      ],
      active: true,
    });
  } else {
    let isCartContainBookId = false;

    cart.books.forEach((book) => {
      if (book.bookId === bookId) {
        book.count += 1;
        isCartContainBookId = true;
      }
    });

    if (!isCartContainBookId) {
      cart.books.push({
        bookId,
        title: book.title,
        count: 1,
        price: book.newPrice,
        availability: bookAvailability,
      });
    }

    cart.save();
  }

  res
    .status(200)
    .cookie("guest", guestId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    })
    .json({
      cart,
      message: "Product added to cart",
    });
};

// @desc post cart
// @route post /api/cart/:userToken/:bookId'
// @acces Pivate

export const decreaseCountBookInCart = async (req, res) => {
  const bookId = req.params.bookId;
  let guestId: string | null = req.cookies.guest;

  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guest: GuestEntity | null = null;

  const jwtCookie: string | undefined = req.cookies.jwt;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  guestId = user ? "" : guestId; // gdy user true, czyszczę guestId -> cookie guest

  let cart = await findOneCart(userId, guestId);

  if (!cart) {
    res.status(400).json({
      message: "Invalid authorisation",
    });
  }

  const book = await Book.findOne({
    _id: bookId,
  });

  if (!book) {
    res.status(400).json({
      message: "Invalid book Id",
    });
  }

  if (book.count <= 0) {
    res.status(400).json({
      message: "Book out of store",
    });
    return;
  }

  cart.books.forEach((book) => {
    if (book.bookId === bookId) {
      book.count -= 1;
    }
  });

  cart.save();

  res
    .status(200)
    .cookie("guest", guestId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    })
    .json({
      message: "Decrease product count",
    });
};

export const deleteBookFromCart = async (req, res) => {
  const bookId = req.params.bookId;
  let guestId: string | null = req.cookies.guest;

  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guest: GuestEntity | null = null;

  const jwtCookie: string | undefined = req.cookies.jwt;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  guestId = user ? "" : guestId; // gdy user true, czyszczę guestId -> cookie guest

  let cart = await findOneCart(userId, guestId);

  if (!cart) {
    res.status(400).json({
      message: "Invalid authorisation",
    });
  }

  cart.books = cart.books.filter((book) => book.bookId !== bookId);

  cart.save();

  res
    .status(200)
    .cookie("guest", guestId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    })
    .json({
      message: "Product deleted from cart",
    });
};

export const changeCartStatus = async (req: Request, res: Response) => {
  const cartId = String(req.params.cartId);

  if (!cartId) {
    res.status(400).json({
      message: "Invalid cart id",
    });
  }

  const cart = await Cart.findOne({ _id: cartId });

  if (!cart) {
    res.status(400).json({
      message: "There is no cart with this id.",
    });
  }

  try {
    cart.active = false;
    await cart.save();

    res.status(200).json({
      message: "Cart active false.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

async function findOneCart(userId: string, guestId: string) {
  return await Cart.findOne({
    $or: [
      {
        user: userId,
        active: true,
      },
      {
        guest: guestId,
        active: true,
      },
    ],
  });
}
