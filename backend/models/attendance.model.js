import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    totalSchoolDays: {
      type: Number,
      required: true
    },
    presentDays: {
      type: Number,
      required: true
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure a student can have only one attendance record per class per month-year
attendanceSchema.index(
  { studentId: 1, classId: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model('Attendance', attendanceSchema);
