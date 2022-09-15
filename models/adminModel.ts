import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add an email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    refreshTokenSalt: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    accessTokenSalt: {
      type: String,
      default: "",
    },
    accessToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model("Admin", adminSchema);
