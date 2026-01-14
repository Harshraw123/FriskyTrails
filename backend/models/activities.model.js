import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activityType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
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

export const Activity = mongoose.model("Activity", activitySchema);
