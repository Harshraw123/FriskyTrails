import axiosInstance from "../utils/axiosInstance";

const registerUser = async ({ firstName, lastName, userName, email, password }) => {
  try {
    const payload = { 
      email, 
      password, 
      name: firstName || email.split('@')[0],
      lastName,
    };

    // Only send userName if provided
    if (userName) {
      payload.userName = userName;
    }

    const response = await axiosInstance.post("/api/v1/user/signup", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post("/api/v1/user/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}  

const logoutUser = async ( ) => {
  try {
    const response = await axiosInstance.post("/api/v1/user/logout");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}  

const getCurrentUser = async ( ) => {
  try {
    // Backend uses GET /me, not POST /get-user
    const response = await axiosInstance.get("/api/v1/user/me");
    return response;
    
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}  

// Google OAuth - backend uses GET /google (redirects to Google)
// This redirects the user to the backend Google OAuth endpoint
const googleAuth = () => {
  const apiUrl = import.meta.env.VITE_API_URL_PROD || 'http://localhost:8000';
  window.location.href = `${apiUrl}/api/v1/user/google`;
};

// OTP functions for email verification
const sendOtp = async ({ email }) => {
  try {
    const response = await axiosInstance.post("/api/auth/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await axiosInstance.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export { loginUser, registerUser , logoutUser , getCurrentUser, googleAuth, sendOtp, verifyOtp };