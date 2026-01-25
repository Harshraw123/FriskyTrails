import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    console.log("---- VERIFY JWT HIT ----");
    console.log("URL:", req.originalUrl);

    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
      console.log("Token source: COOKIE");
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token source: HEADER");
    }

    if (!token || token === "none") {
      console.log("❌ Token missing");
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("🔥 JWT_SECRET NOT SET IN ENV");
      return res.status(500).json({
        success: false,
        message: "Server auth misconfigured",
      });
    }

    console.log("JWT_SECRET length:", JWT_SECRET.length);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token verified:", decoded.id);
    } catch (e) {
      console.error("❌ JWT verify failed:", e.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("❌ User not found:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("🔥 VERIFY JWT CRASH:", err);
    return res.status(500).json({
      success: false,
      message: "Auth middleware failed",
    });
  }
};
