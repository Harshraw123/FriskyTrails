import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // Check if already connected (important for serverless environments)
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    console.log("MongoDB URI:", process.env.MONGODB_URI);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`);

    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit process in serverless environments
    if (process.env.VERCEL !== "1") {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
