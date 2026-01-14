import mongoose from "mongoose";
import crypto from "node:crypto";

const busTicketSchema = new mongoose.Schema(
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
    passengers: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      default: () =>
        "FL-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
   
  },
  { timestamps: true }
);

export const BusTicket = mongoose.model("BusTicket", busTicketSchema);
