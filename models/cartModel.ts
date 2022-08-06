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
    id: String,
    count: Number,
    price: Number,
  }
  ],
  active: Boolean,
},
  {
    timestamps: true
  })

export const Cart = mongoose.model('Cart', cartSchema);