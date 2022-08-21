import { Request, Response } from "express";
import process from "process";
import Stripe from "stripe";
import { config } from "../config/config";
import { User } from "../models";
import { Cart } from "../models/cartModel";
import { GetBooksFromCartResponse, UserEntity } from "../types";
import { verifyToken } from "../utils/logs";
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-08-01',
});


export const createCheckoutSession = async (req: Request, res: Response) => {

  let user: UserEntity | null = null;
  let userId: string | null = null;
  let guestId: string | null = req.cookies.guest;

  const { token = {} } = req.body;

  const jwtCookie: string | undefined = req.cookies.jwt;

  if (jwtCookie) {
    userId = verifyToken(jwtCookie);
    user = await User.findOne({ _id: userId });
  }

  guestId = user ? '' : guestId; // gdy user true, czyszczę guestId z cookie guest

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
    ]
  });

  if (!cart) {
    res
      .status(400)
      .json({
        message: 'Invalid cart credentials. First add product to cart and then click checkout.',
      })
    return;
  }

  const totalCost = cart.books
    .map(book => book.count * book.price)
    .reduce((prev, curr) => {
      return prev + curr
    }, 0)

  const booksFromCart: GetBooksFromCartResponse[] | [] = cart.books;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: booksFromCart.map(book => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: book.title,
            },
            unit_amount: book.price * 100,
          },
          quantity: book.count,
        }
      }),
      success_url: `${config.corsOrigin}/payment/success`,
      cancel_url: `${config.corsOrigin}/payment/cancel`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.log(e)
  }
}