import serverless from "serverless-http";
import connectDB from "../db/index.js";
import dotenv from "dotenv";
import { app } from "../app.js";
import mongoose from "mongoose";

dotenv.config({
  path: './.env'
});

// Connect to MongoDB if not already connected
const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }
};

// Middleware to ensure DB connection on each request
app.use(async (req, res, next) => {
  await ensureDatabaseConnection();
  next();
});

// Export the serverless handler (default export for Vercel)
export default serverless(app);

