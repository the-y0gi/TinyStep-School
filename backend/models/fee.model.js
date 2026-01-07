import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeItems: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    paidDate: Date
  }],
  payments: [{
    amount: Number,
    paymentDate: {
      type: Date,
      default: Date.now
    },
    mode: {
      type: String,
      enum: ['online'],
      default: 'online'
    },
    razorpayPaymentId: String,
    feeItems: [String] // Store fee item names instead of IDs
  }],
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  razorpayOrderId: String
}, { timestamps: true });

export default mongoose.model("Fee", feeSchema);
