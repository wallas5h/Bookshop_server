import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    maxlength: 50,
    required: [true, 'Prease add a title']
  },
  author: {
    type: String,
    lowercase: true,
    maxlength: 50,
    required: [true, 'Prease add a title']
  },
  description: {
    type: String,
    maxlength: 1000,
    lowercase: true,
  },
  newPrice: {
    type: Number,
    min: 0,
    required: true
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  count: {
    type: Number,
    min: 0
  },
  imageURL: {
    type: String,
    lowercase: true,
  },
  category: {
    type: String,
  },
  active: {
    type: Boolean,
  }
},
  {
    timestamps: true
  })

export const Book = mongoose.model('Book', bookSchema);