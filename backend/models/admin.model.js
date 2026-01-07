// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

// Prevent multiple super admins
adminSchema.pre('save', async function(next) {
  const adminCount = await mongoose.models.Admin.countDocuments();
  if (adminCount >= 1) {
    throw new Error("Only one super admin allowed");
  }
  next();
});

export default mongoose.model('Admin', adminSchema);