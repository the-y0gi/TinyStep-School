
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['Nursery', 'Pre-KG', 'KG'],
      required: true
    },
    section: {
      type: String,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      default: 20
    },
    feeStructure: {
      annualFee: {
        type: Number,
        required: true
      },
      tuitionFee: {
        type: Number,
        required: true
      },
      admissionFee: {
        type: Number,
        required: true
      },
      otherCharges: {
        type: Number,
        default: 0
      }
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Class', classSchema);