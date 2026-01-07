// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getProfile,
  sendOtpController,
  verifyOtpController,
  signupController,
  loginUser,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Public Routes
router.post("/register", register); // One-time setup
router.post("/login", login);

// Send OTP to email
router.post("/send-otp", sendOtpController);

// Verify OTP
router.post("/verify-otp", verifyOtpController);

// Final Signup after OTP
router.post("/signup", signupController);

//user login
router.post("/user-login", loginUser);

// 1. Send Password Reset OTP
router.post("/send-reset-otp", sendPasswordResetOtp);

// 2. Verify Password Reset OTP
router.post("/verify-reset-otp", verifyPasswordResetOtp);

// 3. Reset Password
router.post("/reset-password", resetPassword);

export default router;
