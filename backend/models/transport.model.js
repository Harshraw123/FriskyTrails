import mongoose from "mongoose";
import crypto from "node:crypto";

const transportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromLocation: {
      type: String,
      required: true,
    },
    toLocation: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    transportType: {
      type: String,
      enum: ["Bus", "Train", "Flight", "Other"],
      required: true,
    },
    date: {
      type: Date,
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


);

export const Transport = mongoose.model("Transport", transportSchema);
