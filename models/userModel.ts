import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  token: {
    type: String,
    required: false
  },
  terms: {
    type: Boolean,
    required: true
  },
  confirmed: Boolean,

},
  {
    timestamps: true
  })

export const User = mongoose.model('User', userSchema);