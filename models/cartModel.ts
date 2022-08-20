import mongoose from "mongoose";


export const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
  },
  guest: {
    type: String,
    ref: 'Guest',
  },
  books: [{
    bookId: String,
    title: String,
    count: Number,
    price: Number,
    availability: Boolean,
  }
  ],
  active: Boolean,
},
  {
    timestamps: true
  })

export const Cart = mongoose.model('Cart', cartSchema);