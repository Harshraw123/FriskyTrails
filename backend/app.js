import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
// import { app } from "./app.js";

import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";


dotenv.config({
  path: ".env",
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://frisky-trails.vercel.app",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use((req, res, next) => {
  // Set COOP to allow popups for OAuth flows
  // "unsafe-none" allows cross-origin popups which is needed for Google OAuth
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// app.options("*", cors()); 

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// app.options("*", cors());

app.use(express.static("public"));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

import passport from "passport";
import configurePassport from "./config/passport.js";

// Initialize Passport
configurePassport();
app.use(passport.initialize());

//getAllStates
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/blog", blogRoutes);
//ye wala otp verification
app.use("/api/auth", authRoutes);

//harsh

app.use("/api/v1", adventureRoutes);

// Log router object for diagnostics at startup
console.log("app._router at startup:", !!app._router, app._router ? Object.keys(app._router) : null);

// Temporary debug route to inspect registered routes (placed before 404)
app.get("/__routes", (req, res) => {
  try {
    // Support Express 4 & 5 internals: try _router then router
    const stack = (app._router && app._router.stack) || (app.router && app.router.stack) || [];
    const routes = stack
      .filter((layer) => layer.route || layer.name === "router" || layer.regexp)
      .map((layer) => {
        if (layer.route) {
          return { type: "route", path: layer.route.path, methods: layer.route.methods };
        }
        return {
          type: "router",
          name: layer.name,
          regexp: layer.regexp ? layer.regexp.toString() : null,
          handleName: layer.handle && layer.handle.name,
          handleStackLength: layer.handle && layer.handle.stack ? layer.handle.stack.length : null,
          inner: (layer.handle && layer.handle.stack ? layer.handle.stack.map((l) => {
            if (l.route) {
              return { path: l.route.path, methods: l.route.methods };
            }
            return { name: l.name, regexp: l.regexp ? l.regexp.toString() : null };
          }) : []),
        };
      });

    // If no routes found, include some diagnostic info
    if (routes.length === 0) {
      return res.json({
        success: true,
        routes: [],
        diagnostic: {
          hasRouter: !!app._router,
          routerKeys: app._router ? Object.keys(app._router) : [],
          appKeys: Object.getOwnPropertyNames(app),
          hasUse: typeof app.use === 'function'
        },
      });
    }

    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('\n--- ERROR DETAILS ---');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  if (err.errors) console.error('Validation Errors:', err.errors);
  console.error('Request Body:', req.body);
  console.error('Request Params:', req.params);
  console.error('Request Query:', req.query);
  console.error('--- END ERROR DETAILS ---\n');
  
  // Normalize status code: if a Mongoose error code is present (e.g. 11000)
  // map it to an appropriate HTTP status. Only use err.code directly when
  // it is in the valid HTTP range.
  let statusCode = 500;
  if (typeof err.statusCode === 'number' && err.statusCode >= 100 && err.statusCode < 1000) {
    statusCode = err.statusCode;
  } else if (typeof err.code === 'number' && err.code >= 100 && err.code < 1000) {
    statusCode = err.code;
  } else if (err.code === 11000 || err.name === 'MongoServerError') {
    // Mongoose duplicate key or related errors should return 409 Conflict
    statusCode = 409;
  } else if (err.name === 'ValidationError') {
    // Mongoose validation failure
    statusCode = 400;
  } else if (err.name === 'CastError') {
    // Mongoose cast errors (e.g., invalid ObjectId)
    statusCode = 400;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'UnauthorizedError') {
    // JWT/token-related errors
    statusCode = 401;
  } else if (err.status && typeof err.status === 'number') {
    statusCode = err.status;
  }

  // Pull a friendly message if available
  let message = err.message || 'Internal Server Error';
  if (err.code === 11000 && err.keyValue) {
    const key = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${key}`;
  }
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      ...(err.errors && { errors: err.errors })
    })
  });
});

export { app };
