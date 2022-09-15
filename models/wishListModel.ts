import mongoose from "mongoose";


export const wishlistSchema = new mongoose.Schema({
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
    availability: Boolean,
  }
  ],
  active: Boolean,
},
  {
    timestamps: true
  })

export const WishList = mongoose.model('Wishlist', wishlistSchema);