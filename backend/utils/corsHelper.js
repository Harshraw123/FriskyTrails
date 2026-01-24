/**
 * Helper utility to set CORS headers consistently across the application
 */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://frisky-trails.vercel.app",
  "https://frisky-trails-cv8k.vercel.app",
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

/**
 * Check if an origin is allowed
 */
export const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow all vercel previews
  if (origin.endsWith(".vercel.app")) return true;
  return false;
};

/**
 * Set CORS headers on a response
 */
export const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }
};

