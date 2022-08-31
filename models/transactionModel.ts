import mongoose from "mongoose";

export const transactionSchema = new mongoose.Schema(
  {
    addressDetails: {
      name: String,
      street: String,
      city: String,
      postcode: String,
      country: String,
      areaCode: String,
      phone: String,
      email: String,
    },
    orderedBooks: [
      {
        bookId: String,
        title: String,
        count: Number,
        price: Number,
        availability: Boolean,
      },
    ],
    deliveryCost: Number,
    deliveryName: String,
    paymentMethodName: String,
    booksCost: Number,
    totalCost: Number,
    invoice: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
