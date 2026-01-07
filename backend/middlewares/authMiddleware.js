import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';

// Middleware to verify JWT and check Super Admin role
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Check if admin still exists
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found."
      });
    }

    // 4. Verify role (Super Admin only)
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin privileges required."
      });
    }

    // 5. Attach admin to request
    req.admin = admin;
    next();

  } catch (err) {
    // Handle different JWT errors
    let message = "Authentication failed";
    if (err.name === 'TokenExpiredError') {
      message = "Session expired. Please login again.";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Invalid token";
    }

    return res.status(401).json({
      success: false,
      message
    });
  }
};


export default authMiddleware;

export const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    let message = "Authentication failed";
    if (err.name === "TokenExpiredError") {
      message = "Session expired. Please login again.";
    } else if (err.name === "JsonWebTokenError") {
      message = "Invalid token";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};


export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Teacher privileges required.",
    });
  }
  next();
};
