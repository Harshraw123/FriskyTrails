import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { setCorsHeaders } from '../utils/corsHelper.js';

export const protect = async (req, res, next) => {
  try {
    // 🔍 Basic request info
    console.log('--- AUTH MIDDLEWARE HIT ---');
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Origin:', req.headers.origin);

    // Set CORS headers early
    setCorsHeaders(req, res);

    let token;

    // 🔑 Prefer Authorization header (fresh token from login response) over cookie (can be stale)
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token source: AUTH HEADER');
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token source: COOKIE');
    }

    // ❌ No token
    if (!token || token === 'none') {
      console.log('❌ No token found');
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // 🔐 JWT secret — must match user.controller.js (sign uses JWT_SECRET || ACCESS_TOKEN_SECRET || 'my-sec')
    const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET 

    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET is UNDEFINED in ENV');
      return res.status(500).json({
        success: false,
        message: 'Server auth misconfiguration',
      });
    }

    console.log('JWT_SECRET length:', JWT_SECRET.length);
    console.log('Token length:', token.length);

    // 🔍 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified, decoded ID:', decoded.id);
    } catch (jwtError) {
      console.error('❌ JWT VERIFY FAILED:', jwtError.message);
      // Clear bad cookie so the browser stops sending it; client can use Authorization header after next login
      res.clearCookie('token', { path: '/', httpOnly: true, sameSite: 'lax' });
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // 👤 Fetch user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('❌ User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User does not exist',
      });
    }

    console.log('✅ Auth success for user:', user.email);

    req.user = user;
    next();

  } catch (error) {
    console.error('🔥 AUTH MIDDLEWARE CRASH:', error);
    setCorsHeaders(req, res);
    return res.status(500).json({
      success: false,
      message: 'Auth middleware failure',
    });
  }
};
