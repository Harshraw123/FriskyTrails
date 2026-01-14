import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    otp: String,
    otpExpiry: Date,
    
    password: {
      type: String,
      required: false, // Made optional to allow OTP flow - validation handled in signup controller
      minlength: 6, // Only validates if password is provided (since required: false)
      select: false,
      validate: {
        validator: function(value) {
          // Only validate if password is provided and user is not a Google OAuth user
          if (!value) return true; // Allow empty password (for OTP flow)
          if (this.googleId) return true; // Google OAuth users don't need password
          return value.length >= 6;
        },
        message: 'Password must be at least 6 characters long'
      }
    },
    userName: { type: String, unique: true, sparse: true, default: undefined },
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },


  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform user object for JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
