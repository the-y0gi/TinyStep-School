
import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
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
    examType: {
      type: String,
      required: true
    },
    examDate: {
      type: Date,
      required: true
    },
    subjects: [
      {
        name: {
          type: String,
          required: true
        },
        marksObtained: {
          type: Number,
          required: true
        },
        maxMarks: {
          type: Number,
          required: true
        },
        grade: String
      }
    ],
    teacherRemarks: String,
    published: {
      type: Boolean,
      default: false
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    percentage: Number,
    overallGrade: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Result', resultSchema);
