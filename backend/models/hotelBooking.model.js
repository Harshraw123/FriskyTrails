import mongoose from "mongoose";
import crypto from "node:crypto";

const hotelBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    city: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    property:{
      type: String,
      required:true
    },
    guests: {
      type: Number,
      required: true,
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
        "HTL-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
    
  },
  { timestamps: true }
);

export const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);
