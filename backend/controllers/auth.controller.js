// controllers/authController.js
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import { sendOtpEmail,sendForgotPasswordOtpEmail } from "../utils/mailer.js";


// Super Admin Registration (One-time)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Super admin created successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message.includes("allowed")
        ? "Super admin already exists"
        : "Registration failed",
    });
  }
};

// Super Admin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // 2. Verify password (plain text comparison for demo - use bcrypt in production)
    if (password !== admin.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "superadmin",
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Admin Profile
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });

    if (!user || user.role !== "teacher") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        teacher: {
          id: user._id,
          name: user.personalInfo.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1. Get Teacher Profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id)
      .select("-password")
      .populate("teacherDetails.assignedClasses.classId", "name section");

    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 2. Update Teacher Profile
export const updateTeacherProfile = async (req, res) => {
  try {
    const { name, phone, address, qualifications, profileImage } = req.body;

    const teacher = await User.findById(req.user.id);

    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    // Update personal info
    if (name) teacher.personalInfo.name = name;
    if (phone) teacher.personalInfo.phone = phone;
    if (address !== undefined) teacher.personalInfo.address = address;
    if (profileImage !== undefined)
      teacher.personalInfo.profileImage = profileImage;

    // Update teacher details
    if (qualifications !== undefined)
      teacher.teacherDetails.qualifications = qualifications;

    await teacher.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        data: teacher,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// 3. Change Password
export const changeTeacherPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const teacher = await User.findById(req.user.id);

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, teacher.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    teacher.password = hashed;
    await teacher.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Store OTPs in memory temporarily
const otpStore = new Map(); // email => { otp, expiresAt }
export { otpStore };

// 1. Send OTP to Email
export const sendOtpController = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt });

    // Send the OTP via Email
    await sendOtpEmail({ to: email, otp });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2. Verify OTP
export const verifyOtpController = (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore.get(email);
  if (!stored)
    return res.status(400).json({ message: "No OTP found for this email" });

  if (stored.expiresAt < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  if (stored.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // Mark verified
  otpStore.set(email, { ...stored, verified: true });

  return res.status(200).json({ message: "OTP verified" });
};

// 3. Final Signup
export const signupController = async (req, res) => {
  const { email, password, role, personalInfo } = req.body;

  const otpData = otpStore.get(email);
  if (!otpData?.verified)
    return res
      .status(400)
      .json({ message: "OTP not verified or session expired" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      personalInfo,
    });

    otpStore.delete(email); // Clean up store

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        personalInfo: newUser.personalInfo,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Basic validations
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user and populate children details
    const user = await User.findOne({ email })
      .populate({
        path: 'children',
        select: '_id name classInfo.current.name status', // Select only necessary fields
        populate: { // Nested populate for class info
          path: 'classInfo.current.classId',
          select: 'name section'
        }
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Format children data for response
    const formattedChildren = user.children.map(child => ({
      _id: child._id,
      name: child.name,
      class: child.classInfo?.current?.classId?.name || 'Not assigned',
      section: child.classInfo?.current?.classId?.section || '',
      status: child.status
    }));

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.personalInfo.name,
        children: formattedChildren // Include formatted children data
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes expiry

    otpStore.set(email, { otp, expiresAt });

    // Send the OTP via Email (implement sendOtpEmail function similar to your existing one)
    // await sendOtpEmail({ 
    //   to: email, 
    //   otp,
    //   subject: "Password Reset OTP",
    //   text: `Your password reset OTP is ${otp}. It expires in 30 minutes.`
    // });
        await sendOtpEmail({ to: email, otp });

    sendForgotPasswordOtpEmail
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2. Verify Password Reset OTP
export const verifyPasswordResetOtp = (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore.get(email);
  if (!stored)
    return res.status(400).json({ message: "No OTP found for this email" });

  if (stored.expiresAt < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  if (stored.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // Mark verified
  otpStore.set(email, { ...stored, verified: true });

  return res.status(200).json({ message: "OTP verified" });
};

// 3. Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  const otpData = otpStore.get(email);
  if (!otpData?.verified)
    return res.status(400).json({ message: "OTP not verified or session expired" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpStore.delete(email); // Clean up store

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ message: "Password reset failed" });
  }
};

