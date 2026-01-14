import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sheetConfig } from '../config/sheetConfig.js';
import { pushToSheet } from '../utils/pushToSheet.js';

// Environment variables (set these in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_EXPIRES_DAYS = 7;

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Set HTTP-only cookie with JWT
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // Must be secure + sameSite='none' for cross-site cookies to be accepted by browsers
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  // Allow optional cookie domain override for multi-domain deployments
  if (process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  const payload = {
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
  };

  // For local development, expose token in the response so dev clients can
  // use Authorization header when Secure cookies are not available (HTTP).
  if (process.env.NODE_ENV !== 'production') {
    payload.token = token;
  }

  res.status(statusCode).cookie('token', token, cookieOptions).json(payload);
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const { email, password, name, userName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate password length (since it's optional in schema for OTP flow)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }
 

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email with OTP first. Send OTP to your email address.',
      });
    }

    // Check if email is verified
    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please verify your email with OTP before completing signup.',
      });
    }

    // Check if user already has a password (already signed up)
    if (existingUser.password) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.',
      });
    }

    // Update user with password and other details
    existingUser.password = password;
    if (name) existingUser.name = name;
    if (userName) existingUser.userName = userName;
    else if (!existingUser.userName) {
      existingUser.userName = email.split("@")[0];
    }
    
    await existingUser.save(); // ✅ DB first
    
    // 🔥 PUSH TO GOOGLE SHEET (AFTER DB SUCCESS)
    // Only sync if user wasn't already synced (check if user was created before password was set)
    // Since user was created during OTP flow, it should already be in sheet
    // But we'll sync again to ensure updated data (with password set) is reflected
    // Note: This might create a duplicate entry - consider updating existing row instead
    const config = sheetConfig.User;
    
    await pushToSheet({
      sheetName: config.sheetName,
      columns: config.columns,
      document: existingUser,
    });
    
    sendTokenResponse(existingUser, 201, res);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        admin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = (req, res) => {
    const clearCookieOptions = {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    if (process.env.COOKIE_DOMAIN) {
      clearCookieOptions.domain = process.env.COOKIE_DOMAIN;
    }
    res
      .status(200)
      .cookie('token', 'none', clearCookieOptions)
    .json({
      success: true,
      message: 'Logged out successfully',
    });
};

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleCallback = async (req, res) => {
  try {
    // User is attached by passport middleware
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=google_auth_failed`);
    }

    const token = generateToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    if (process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res
      .cookie('token', token, cookieOptions)
      .redirect(process.env.CLIENT_URL || '/');
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=server_error`);
  }
};
