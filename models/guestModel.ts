import mongoose from "mongoose";


const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },

},
  {
    timestamps: true
  })

export const Guest = mongoose.model('Guest', guestSchema);