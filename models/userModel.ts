import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  token: {
    type: String,
    required: false
  }

},
  {
    timestamps: true
  })

export const User = mongoose.model('User', userSchema);