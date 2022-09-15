import { Request, Response } from "express";
import process from "process";
import Stripe from "stripe";
import { config } from "../config/config";
import { User } from "../models";
import { Book } from "../models/bookModel";
import { Cart } from "../models/cartModel";
import { Transaction } from "../models/transactionModel";
import { GetBooksFromCartResponse, UserEntity } from "../types";
import { verifyToken } from "../utils/logs";
import { EmailSubject, EmailView } from "../utils/mailer.utils";
import { sendOrderMail } from "../utils/order.mailer";
import { sendOrderMailToBoss } from "../utils/orderToResume.mailer";
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2022-08-01",
});

// @desc post cart
// @route post /api/checkout/create-checkout-session'
// @acces Pivate

export const createCheckoutSession = async (req: Request, res: Response) => {
  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guestId: string | null = req.cookies.guest;

  const { deliveryCost, deliveryName, paymentMethodType } = req.body;

  const jwtCookie: string | undefined = req.cookies.jwt;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  guestId = user ? "" : guestId; // gdy user true, czyszczę guestId z cookie guest

  // if (!user && !guestId) {
  //   res
  //     .status(400)
  //     .json({
  //       message: 'Invalid credentials. Login or as a guest add product to cart and then click checkout.',
  //     })
  //   return;
  // }

  let cart = await Cart.findOne({
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

  if (!cart) {
    res.status(400).json({
      message:
        "Invalid cart credentials. First add product to cart and then click checkout.",
    });
    return;
  }

  let books = cart.books.filter((book) => book.count > 0);

  const booksFromCartForCheckout: GetBooksFromCartResponse[] | [] = books;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [paymentMethodType],
      mode: "payment",

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Number(deliveryCost) * 100,
              currency: "pln",
            },
            display_name: String(deliveryName),
          },
        },
      ],
      line_items: booksFromCartForCheckout.map((book) => {
        return {
          price_data: {
            currency: "pln",
            product_data: {
              name: book.title,
            },
            unit_amount: book.price * 100,
          },
          quantity: book.count,
        };
      }),
      success_url: `${config.corsOrigin}/payment/success`,
      cancel_url: `${config.corsOrigin}/payment/cancel`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

// @desc put cart
// @route put /api/checkout/checkout-success/:cartId'
// @acces Pivate

export const changesAfterPayment = async (req, res) => {
  const cartId = req.params.cartId;
  const {
    addressDetails,
    deliveryCost,
    deliveryName,
    paymentMethodName,
    booksCost,
    invoice,
  } = req.body;

  if (!cartId) {
    res.status(400).json({
      message: "Invalid cart Id",
    });
  }

  const cart = await Cart.findOne({
    _id: cartId,
    active: true,
  });

  if (!cart) {
    res.status(400).json({
      message: "There is no active cart with this id.",
    });
    return;
  }

  let books = cart.books;

  books.forEach(async (book) => {
    const changedBook = await Book.findOne({
      _id: book.bookId,
    });
    changedBook.count -= book.count;
    changedBook.save();
  });

  const totalCost = (Number(deliveryCost) + Number(booksCost)).toFixed(2);
  const date = new Date().toLocaleString();

  let orderedBooks = cart.books.filter((book) => book.count > 0);

  const transaction = await Transaction.create({
    orderedBooks,
    addressDetails,
    deliveryCost,
    deliveryName,
    paymentMethodName,
    booksCost,
    totalCost,
    invoice,
  });

  sendOrderMail(
    transaction._id,
    addressDetails.email,
    EmailSubject.order,
    EmailView.order,
    orderedBooks,
    addressDetails,
    deliveryCost,
    deliveryName,
    paymentMethodName,
    booksCost,
    totalCost,
    date,
    invoice
  );

  sendOrderMailToBoss(
    transaction._id,
    config.ownerEmail,
    EmailSubject.orderInfo,
    EmailView.orderInfo,
    orderedBooks,
    addressDetails,
    deliveryCost,
    deliveryName,
    paymentMethodName,
    booksCost,
    totalCost,
    date,
    invoice
  );

  res.end();
};
