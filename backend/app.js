import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import stateRoutes from "./routes/state.routes.js";

import passport from "passport";
import configurePassport from "./config/passport.js";

/* =======================
   ENV CONFIG
======================= */
try {
  if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
    dotenv.config({ path: ".env" });
  } else {
    dotenv.config();
  }
} catch (error) {
  console.log("Note: .env file not found, using environment variables");
}

/* =======================
   CORS CONFIG (FIXED)
======================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://frisky-trails.vercel.app",
  "https://frisky-trails-cv8k.vercel.app",
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
]

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  // allow all vercel previews
  if (origin.endsWith(".vercel.app")) return true;

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        // IMPORTANT: send exact origin (not true)
        callback(null, origin);
      } else {
        console.warn("CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

/* ❌ REMOVED app.options("*") — this was breaking preflight on Vercel */

/* =======================
   COOP / COEP
======================= */
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

/* =======================
   BODY & COOKIE
======================= */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* =======================
   REQUEST LOGGER
======================= */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* =======================
   PASSPORT
======================= */
configurePassport();
app.use(passport.initialize());

/* =======================
   ROUTES (UNCHANGED)
======================= */
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/v1", adventureRoutes);
app.use("/api/states", stateRoutes);

/* =======================
   ROUTE DEBUGGER (UNCHANGED)
======================= */
console.log("app._router at startup:", !!app._router);

app.get("/__routes", (req, res) => {
  try {
    const stack =
      (app._router && app._router.stack) ||
      (app.router && app.router.stack) ||
      [];

    const routes = stack.map((layer) => {
      if (layer.route) {
        return {
          path: layer.route.path,
          methods: layer.route.methods,
        };
      }
      return {
        name: layer.name,
        regexp: layer.regexp?.toString(),
      };
    });

    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =======================
   404 HANDLER (CORS SAFE)
======================= */
app.use((req, res) => {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("\n--- ERROR DETAILS ---");
  console.error("URL:", req.originalUrl);
  console.error("METHOD:", req.method);
  console.error("MESSAGE:", err.message);

  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  let statusCode = 500;

  if (err.statusCode >= 100 && err.statusCode < 600) {
    statusCode = err.statusCode;
  } else if (err.code === 11000) {
    statusCode = 409;
  } else if (
    err.name === "ValidationError" ||
    err.name === "CastError"
  ) {
    statusCode = 400;
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "UnauthorizedError"
  ) {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
