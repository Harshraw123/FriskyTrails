// import serverless from "serverless-http";
// import mongoose from "mongoose";
// import connectDB from "../db/index.js";
// import app from "../app.js";

// // Cache database connection for serverless
// let dbConnectionPromise = null;

// // Initialize database connection
// const initializeDB = async () => {
//   // If connection is already established, return
//   if (dbConnectionPromise && mongoose.connection.readyState === 1) {
//     return;
//   }

//   // If connection is in progress, wait for it
//   if (dbConnectionPromise) {
//     await dbConnectionPromise;
//     return;
//   }

//   // Start new connection
//   try {
//     dbConnectionPromise = connectDB();
//     await dbConnectionPromise;
//     console.log("✅ Database initialized for serverless function");
//   } catch (error) {
//     console.error("❌ Database connection error:", error.message);
//     dbConnectionPromise = null;
//     throw error;
//   }
// };

// // Wrap Express app with serverless-http
// const handler = serverless(app, {
//   binary: ["image/*", "application/pdf"],
// });

// // Connect to DB before handling requests
// export default async (req, res) => {
//   try {
//     await initializeDB();
//   } catch (error) {
//     console.error("Database initialization failed:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//       ...(process.env.NODE_ENV === "development" && { 
//         error: error.message,
//         stack: error.stack 
//       }),
//     });
//   }
  
//   return handler(req, res);
// };

