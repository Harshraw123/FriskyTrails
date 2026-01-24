import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adventureRoutes from "./routes/adventure.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import stateRoutes from "./routes/state.routes.js";

import configurePassport from "./config/passport.js";
import { isOriginAllowed, setCorsHeaders } from "./utils/corsHelper.js";

dotenv.config();

const app = express();

/* =======================
   CORS (SAME CLEAN PATTERN)
======================= */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // postman / server-to-server

    if (isOriginAllowed(origin)) {
      return callback(null, origin); // exact origin for cookies
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/* =======================
   BODY / COOKIE
======================= */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

/* =======================
   COOP / COEP (OAuth Safe)
======================= */
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

/* =======================
   PASSPORT (SAFE ON VERCEL)
======================= */
configurePassport();
app.use(passport.initialize());

/* =======================
   REQUEST LOGGER
======================= */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* =======================
   ROUTES
======================= */
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/v1", adventureRoutes);
app.use("/api/states", stateRoutes);

/* =======================
   HEALTH CHECKS
======================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Frisky Trails API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/* =======================
   ROUTE DEBUGGER
======================= */
app.get("/__routes", (req, res) => {
  try {
    const stack =
      (app._router && app._router.stack) ||
      (app.router && app.router.stack) ||
      [];

    const routes = stack.map((layer) => {
      if (layer.route) {
        return { path: layer.route.path, methods: layer.route.methods };
      }
      return { name: layer.name };
    });

    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  setCorsHeaders(req, res);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  setCorsHeaders(req, res);

  let statusCode = 500;

  if (typeof err.statusCode === "number" && err.statusCode >= 100 && err.statusCode < 600) {
    statusCode = err.statusCode;
  } else if (err.code === 11000) {
    statusCode = 409;
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  } else if (err.name === "JsonWebTokenError" || err.name === "UnauthorizedError") {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* =======================
   EXPORT (VERCEL STYLE)
======================= */
export default app;

/* =======================
   LOCAL DEV SERVER ONLY
======================= */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
