import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    parentDetails: {
      fatherName: String,
      motherName: String,
      guardianName: String, // Add this
      relation: String, // Add this
      primaryContact: String,
      alternateContact: String,
      emergencyContact: String,
      address: String,
      email: String,
      fatherOccupation: String, // Add this
      motherOccupation: String, // Add this
    },
    medicalInfo: {
      bloodGroup: String,
      allergies: String,
      specialNeeds: String,
      height: Number, // in cm
      weight: Number, // in kg
    },
    previousSchool: String,
    documents: {
      birthCertificate: String, // Change to accept strings
      aadharCard: String, // Change to accept strings
      photo: String, // Change to accept strings
      addressProof: String, // Change to accept strings
      parentAadhar: String, // Change to accept strings
    },
    classInfo: {
      current: {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
        name: {
          type: String,
          enum: ["Nursery", "Pre-KG", "KG"],
        },
        section: String,
        academicYear: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", studentSchema);
