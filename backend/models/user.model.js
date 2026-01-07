import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "parent"],
      required: true,
    },
    personalInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: String,
      profileImage: String,
    },
    familyInfo: {
      annualIncome: String,
      occupation: String,
      religion: String,
      category: String,
    },

    teacherDetails: {
      qualifications: String,
      joiningDate: Date,
      assignedClasses: [
        {
          classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
          },
        },
      ],
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
