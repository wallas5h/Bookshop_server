import mongoose from "mongoose";


export const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: [true, 'Please add a text value']
  }
},
  {
    timestamps: true
  })

export const Goal = mongoose.model('Goal', goalSchema); 