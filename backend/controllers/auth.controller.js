import User from "../models/user.model.js";
import { generateOTP } from "../utils/generateOtp.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "../config/sheetConfig.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email format" 
      });
    }

    const lowerEmail = email.toLowerCase();
    let user = await User.findOne({ email: lowerEmail });
    const isNewUser = !user;
    
    if (isNewUser) {
      user = await User.create({ email: lowerEmail });
      // Sync new user to Google Sheet
      const config = sheetConfig.User;
      await pushToSheet({
        sheetName: config.sheetName,
        columns: config.columns,
        document: user,
      });
    } else {
      // Block if active OTP exists
      if (user.otp && user.otpExpiry && user.otpExpiry > Date.now()) {
        return res.status(429).json({ 
          success: false,
          message: "OTP already sent. Please check your email." 
        });
      }
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendOTPEmail(lowerEmail, otp);

    res.status(200).json({ 
      success: true,
      message: "OTP sent successfully to your email" 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to send OTP. Please try again." 
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "Email and OTP are required" 
      });
    }

    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found. Please send OTP first." 
      });
    }

    if (!user.otp) {
      return res.status(400).json({ 
        success: false,
        message: "No OTP found. Please request a new OTP." 
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP. Please check and try again." 
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new OTP." 
      });
    }

    // All checks passed: verify and clear
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Email verified successfully. You can now complete your signup.",
      data: { email: lowerEmail, verified: true } // Optional: return user info
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to verify OTP. Please try again." 
    });
  }
};
