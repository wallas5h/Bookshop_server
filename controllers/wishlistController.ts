import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { User } from "../models";
import { Book } from '../models/bookModel';
import { Guest } from "../models/guestModel";
import { WishList } from '../models/wishListModel';
import { GuestEntity, UserEntity } from "../types";
import { verifyToken } from '../utils/logs';


// @desc get cart
// @route get /api/cart
// @acces Pivate

export const getBooksFromWishlist = async (req, res) => {

  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guest: GuestEntity | null = null;

  const jwtCookie: string | undefined = req.cookies.jwt;
  let guestId: string | null = req.cookies.guest;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }


  let wishlist = await WishList.findOne({
    $or: [
      {
        user: userId,
        active: true,
      },
      {
        guest: guestId,
        active: true,
      },
    ]
  });

  if (!wishlist) {
    res
      .status(200)
      .json({
        books: [],
      })
  }

  res
    .status(200)
    .json({
      books: wishlist.books,
    })
}

// @desc post cart
// @route post /api/cart/:userToken/:bookId'
// @acces Pivate

export const addBookToWishlist = async (req, res) => {

  var { guestId, user, guest, userId, bookId }: { guestId: string; user: UserEntity; guest: GuestEntity; userId: string; bookId: any; } = await newFunction(req);

  guestId = user ? '' : guestId;   // gdy user true, czyszczę guestId -> cookie guest

  let bookAvailability: Boolean = true;

  if (!user && !guestId) {
    guest = await Guest.create({
      name: `guest-${uuid()}`
    })
    guestId = guest._id;
  }

  let wishList = await WishList.findOne({
    $or: [
      {
        user: userId,
        active: true,
      },
      {
        guest: guestId,
        active: true,
      },
    ]
  });

  const book = await Book.findOne({
    _id: bookId
  })


  if (!book) {
    res
      .status(400)
      .json({
        message: 'Invalid book Id',
      })
  }

  if (!book.count) {
    bookAvailability = false;
  }

  if (!wishList && user) {
    wishList = await WishList.create({
      user: userId,
      guest: '',
      books: [
        {
          bookId,
          availability: bookAvailability,
        }],
      active: true
    })

  } else if (!wishList && guestId) {
    wishList = await WishList.create({
      user: '',
      guest: guestId,
      books: [
        {
          bookId,
          availability: bookAvailability,
        }],
      active: true
    })

  }
  else {

    let isWishlistContainBookId = false;

    wishList.books.forEach(book => {
      if (book.bookId === bookId) {
        isWishlistContainBookId = true;
      }
    });

    if (isWishlistContainBookId) {
      res
        .status(200)
        .cookie('guest', guestId, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        })
        .json({
          message: 'Product just existed in Wishlist',
        })
    }

    if (!isWishlistContainBookId) {
      wishList.books.push(
        {
          bookId,
          availability: bookAvailability,
        });
    }

    wishList.save();
  }

  res
    .status(200)
    .cookie('guest', guestId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    })
    .json({
      wishlist: wishList,
      message: 'Product added to wishlist',
    })

}



export const deleteBookFromWishlist = async (req, res) => {

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

  guestId = user ? '' : guestId;   // gdy user true, czyszczę guestId -> cookie guest

  let wishlist = await WishList.findOne({
    $or: [
      {
        user: userId,
        active: true,
      },
      {
        guest: guestId,
        active: true,
      },
    ]
  });

  if (!wishlist) {
    res
      .status(400)
      .json({
        message: 'Invalid authorisation',
      })
  }

  wishlist.books = wishlist.books.filter(book => book.bookId !== bookId);

  wishlist.save();

  res
    .status(200)
    .cookie('guest', guestId, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    })
    .json({
      message: 'Product deleted from wishlist',
    })
}


async function newFunction(req: Request) {
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
  return { guestId, user, guest, userId, bookId };
}

