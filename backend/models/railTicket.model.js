import mongoose from "mongoose";
import crypto from "node:crypto";


const railTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromStation: {
      type: String,
      required: true,
    },
    toStation: {
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
      enum: ["Sleeper", "AC", "General"],
      required: true,
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

    email:{
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    }
  },
  { timestamps: true }
);

export const RailTicket = mongoose.model("RailTicket", railTicketSchema);
