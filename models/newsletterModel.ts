import mongoose from "mongoose";
import { isEmail } from 'validator';


const newsleterSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Please add an email'],
    validate: [isEmail, 'invalid email']
  },
},
  {
    timestamps: true
  })

export const Newsletter = mongoose.model('newsletter', newsleterSchema);