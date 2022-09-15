import mongoose from "mongoose";
import process from "process";


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}