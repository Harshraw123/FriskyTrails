"use client";
import { useEffect, useState } from "react";
import { loginUser, registerUser, googleAuth, sendOtp, verifyOtp } from "../api/user.api";

const LoginModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1); // 1: email, 2: OTP, 3: password & details
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    // The backend will handle the OAuth flow and redirect back with a cookie
    googleAuth();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.email) {
      alert("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const response = await sendOtp({ email: form.email });
      if (response.success) {
        setOtpSent(true);
        setSignupStep(2);
        alert("OTP sent successfully to your email!");
      } else {
        alert(response.message || "Failed to send OTP");
      }
    } catch (error) {
      alert(error.message || error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!form.otp) {
      alert("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp({ email: form.email, otp: form.otp });
      if (response.success) {
        setSignupStep(3);
        alert("Email verified successfully! Please complete your registration.");
      } else {
        alert(response.message || "OTP verification failed");
      }
    } catch (error) {
      alert(error.message || error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });
        if (response.success) {
          // In dev the backend returns token in body; store it so /me uses it via Authorization header
          // (avoids stale-cookie "invalid signature" when cookie and sign secret get out of sync)
          if (response.token) {
            localStorage.setItem("token", response.token);
          }
          if (response.user?.name) {
            localStorage.setItem("userName", response.user.name);
            localStorage.setItem("firstName", response.user.name.split(' ')[0] || response.user.name);
          }
          onClose();
          // Reload to update auth state
          window.location.reload();
        } else {
          alert("Login failed");
        }
      } else {
        // Signup - Step 3: Complete registration
        const response = await registerUser(form);
        if (response.success) {
          alert("Registration successful! Please login.");
          setIsLogin(true);
          setSignupStep(1);
          setOtpSent(false);
          setForm({
            userName: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            otp: "",
          });
        } else {
          alert("Registration failed");
        }
      }
    } catch (error) {
      alert(error.message || error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] backdrop-blur-sm  flex justify-center items-center px-4">
      <div className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-500 hover:text-black"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : signupStep === 1 ? "Register - Step 1" : signupStep === 2 ? "Verify Email" : "Complete Registration"}
        </h2>

        {/* Form */}
        {isLogin ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <>
            {/* Step 1: Enter Email and Send OTP */}
            {signupStep === 1 && (
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {signupStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p className="text-sm text-gray-600 mb-3">
                  We've sent an OTP to <strong>{form.email}</strong>
                </p>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 border rounded"
                  maxLength={6}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep(1);
                      setForm({ ...form, otp: "" });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 bg-black text-white py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* Step 3: Enter Password and Other Details */}
            {signupStep === 3 && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={form.userName}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 border rounded bg-gray-100"
                  disabled
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setSignupStep(2)}
                  className="w-full mb-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded hover:bg-amber-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </form>
            )}
          </>
        )}

        {/* Google OAuth */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Toggle Login/Register */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setSignupStep(1);
                setOtpSent(false);
                setForm({
                  userName: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  otp: "",
                });
              }}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
