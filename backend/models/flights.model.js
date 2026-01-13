import mongoose from "mongoose";
import crypto from "node:crypto";


const flightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromCity: {
      type: String,
      required: true,
    },
    toCity: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    travelClass: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business", "First Class"],
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    airline: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      default: () =>
        "FL-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
  },
  { timestamps: true }
);

export const Flight = mongoose.model("Flight", flightSchema);
