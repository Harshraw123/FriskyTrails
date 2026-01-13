import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { pushToSheet } from "../utils/pushToSheet.js";
import { sheetConfig } from "./sheetConfig.js";

const configurePassport = () => {
 
  let apiUrl = (process.env.API_URL || 'http://localhost:8000').trim();
  apiUrl = apiUrl.replace(/\/+$/, '');
  // Allow explicit override but default to backend callback
  const callbackURL =
    (process.env.GOOGLE_REDIRECT_URI || '').trim() ||
    `${apiUrl}/api/v1/user/google/callback`;

  // Log the callback URL for debugging 
  console.log('=== Google OAuth Configuration ===');
  console.log('API_URL from env:', process.env.API_URL || 'NOT SET (using default)');
  console.log('Final Callback URL:', callbackURL);
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
  console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
  console.log('===================================');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL

      },


     
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value;
          const name = profile.displayName;
          const generatedUserName = email ? email.split("@")[0] : `user_${googleId}`;

          // 1. Check existing Google user
          let user = await User.findOne({ googleId });

          if (user) {
            return done(null, user);
          }

          // 2. Check if user exists by email
          user = await User.findOne({ email });

          if (user) {
            // Link google account
            const isNewUser = !user.googleId; // Track if this is first time linking
            user.googleId = googleId;
            if (!user.avatar && avatar) {
              user.avatar = avatar;
            }

            await user.save();
            
            // Sync to sheet if this is first time linking Google account
            if (isNewUser) {
              const config = sheetConfig.User;
              await pushToSheet({
                sheetName: config.sheetName,
                columns: config.columns,
                document: user,
              });
            }
            
            return done(null, user);
          }

          // 3. Create a new user
          user = await User.create({
            googleId,
            email,
            name,
            avatar,
            isVerified: true, // Google = Verified by default
            userName: generatedUserName,
          });

          // Sync new Google OAuth user to sheet
          const config = sheetConfig.User;
          await pushToSheet({
            sheetName: config.sheetName,
            columns: config.columns,
            document: user,
          });

          return done(null, user);
        } catch (error) {
          console.error("Google OAuth Error:", error);
          return done(error, null);
        }
      }
    )
  );

  // Required for session login
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
