import Student from "../models/student.model.js";
import Class from "../models/class.model.js";

import { NotFoundError, BadRequestError } from "../middlewares/errorHandler.js";
import path from "path";
import fs from "fs/promises";
import User from "../models/user.model.js";

export const getPendingStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: "pending" }).populate(
      "parentId",
      "personalInfo.name personalInfo.email"
    );

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/studentController.js
export const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body; // Optional rejection reason

    // 1. Find and update student status
    const rejectedStudent = await Student.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: rejectionReason || "No reason provided",
      },
      { new: true }
    );

    if (!rejectedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2. Optional: Send rejection notification to parent
    // (Would integrate with notification service)

    res.json({
      success: true,
      message: "Student application rejected",
      data: {
        id: rejectedStudent._id,
        name: rejectedStudent.name,
        status: rejectedStudent.status,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to reject student",
      error: err.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { status, classId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (classId) query["classInfo.current.classId"] = classId;

    const students = await Student.find(query)
      .populate({
        path: "parentId",
        select:
          "personalInfo.name personalInfo.email personalInfo.phone personalInfo.address personalInfo.occupation",
      })
      .populate({
        path: "classInfo.current.classId",
        select: "name section",
      })
      .sort({ createdAt: -1 })
      .lean();

    const response = students.map((student) => ({
      _id: student._id,
      name: student.name,
      status: student.status,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      classInfo: {
        current: {
          classId: student.classInfo?.current?.classId?._id,
          className: student.classInfo?.current?.classId?.name,
          section: student.classInfo?.current?.classId?.section,
        },
      },
      parentInfo: {
        _id: student.parentId?._id,
        name: student.parentId?.personalInfo?.name,
        email: student.parentId?.personalInfo?.email,
        phone: student.parentId?.personalInfo?.phone,
        address: student.parentId?.personalInfo?.address,
        occupation: student.parentId?.personalInfo?.occupation,
      },
      admissionDate: student.admissionDate,
      // Include other student fields as needed
    }));

    res.json({
      success: true,
      count: students.length,
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: err.message,
    });
  }
};

export const getStudentDetails = async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id)
    .populate("parentId", "personalInfo familyInfo")
    .lean();

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const parent = student.parentId;

  const response = {
    id: student._id,
    childName: student.name,
    dateOfBirth: student.dob,
    gender: student.gender,
    grade: student.classInfo?.current?.name || "Not assigned",
    section: student.classInfo?.current?.section || "-",
    academicYear: student.classInfo?.current?.academicYear || "-",

    // Parent Info
    parentName: parent?.personalInfo?.name,
    email: parent?.email,
    phone: parent?.personalInfo?.phone,
    address: parent?.personalInfo?.address,
    profileImage: parent?.personalInfo?.profileImage,
    annualIncome: parent?.familyInfo?.annualIncome,
    religion: parent?.familyInfo?.religion,
    category: parent?.familyInfo?.category,
    occupation: parent?.familyInfo?.occupation,

    // Parent Details from student document
    parentDetails: {
      fatherName: student.parentDetails?.fatherName,
      motherName: student.parentDetails?.motherName,
      guardianName: student.parentDetails?.guardianName,
      relation: student.parentDetails?.relation,
      primaryContact: student.parentDetails?.primaryContact,
      alternateContact: student.parentDetails?.alternateContact,
      emergencyContact: student.parentDetails?.emergencyContact,
      email: student.parentDetails?.email,
      address: student.parentDetails?.address,
      fatherOccupation: student.parentDetails?.fatherOccupation,
      motherOccupation: student.parentDetails?.motherOccupation,
    },

    previousSchool: student.previousSchool,

    // Medical
    medicalInfo: {
      bloodGroup: student.medicalInfo?.bloodGroup,
      allergies: student.medicalInfo?.allergies,
      specialNeeds: student.medicalInfo?.specialNeeds,
      height: student.medicalInfo?.height,
      weight: student.medicalInfo?.weight,
    },

    // Admission
    admissionDate: student.createdAt,
    status: student.status,

    // Documents
    documents: [
      {
        label: "Birth Certificate",
        url: student.documents?.birthCertificate,
      },
      {
        label: "Child Photo",
        url: student.documents?.photo,
      },
      {
        label: "Child Aadhar Card",
        url: student.documents?.aadharCard,
      },
      {
        label: "Parent Aadhar Card",
        url: student.documents?.parentAadhar,
      },
      {
        label: "Address Proof",
        url: student.documents?.addressProof,
      },
    ].filter((doc) => doc.url), // remove empty/null
  };

  res.status(200).json(response);
};

// Download student document
export const downloadStudentDocument = async (req, res) => {
  const { studentId, docType } = req.params;

  // Validate document type
  const validDocTypes = [
    "birthCertificate",
    "childPhoto",
    "childAadhar",
    "parentAadhar",
    "addressProof",
  ];
  if (!validDocTypes.includes(docType)) {
    throw new BadRequestError("Invalid document type");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const filePath = student.documents?.[docType];
  if (!filePath) {
    throw new NotFoundError("Document not found");
  }

  // Construct absolute path
  const absolutePath = path.join(process.cwd(), filePath);

  try {
    // Check if file exists
    await fs.access(absolutePath);

    // Determine content type
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if ([".jpg", ".jpeg"].includes(ext)) {
      contentType = "image/jpeg";
    } else if (ext === ".png") {
      contentType = "image/png";
    }

    // Set headers and send file
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(absolutePath)}"`
    );

    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("File access error:", err);
    throw new NotFoundError("Document file not found");
  }
};

export const assignClass = async (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.body;

  // 1. Validate student exists
  const student = await Student.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // 2. Handle class removal (when classId is empty)
  if (!classId) {
    student.class = undefined;
    await student.save();
    return res.json({
      success: true,
      message: "Student removed from class",
      student,
    });
  }

  // 3. Validate new class exists
  const classObj = await Class.findById(classId);
  if (!classObj) {
    throw new NotFoundError("Class not found");
  }

  // 4. Check class capacity (example: max 20 students)
  const currentStudents = await Student.countDocuments({ class: classId });
  if (currentStudents >= 20) {
    throw new BadRequestError("Class has reached maximum capacity");
  }

  // 5. Prevent duplicate assignment
  if (student.class?.toString() === classId) {
    throw new BadRequestError("Student already in this class");
  }

  // 6. Perform assignment
  student.class = classId;
  await student.save();

  // 7. Return updated student with class details
  const updatedStudent = await Student.findById(studentId).populate(
    "class",
    "name section"
  );

  res.json({
    success: true,
    message: `Assigned to ${classObj.name} (${classObj.section})`,
    student: updatedStudent,
  });
};

//     Get parent registration status
export const getParentStatus = async (req, res) => {
  try {
    const parent = req.user;

    // Verify parent role
    if (parent.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Parent account required.",
      });
    }

    // Check if parent has any registered children
    if (!parent.children || parent.children.length === 0) {
      return res.json({
        success: true,
        hasRegisteredKid: false,
        isApproved: false,
        message: "No child registered",
      });
    }

    // Get the first child (assuming one child per parent)
    const child = await Student.findById(parent.children[0]);

    if (!child) {
      return res.json({
        success: true,
        hasRegisteredKid: false,
        isApproved: false,
        message: "Child record not found",
      });
    }

    // Return status based on child's approval
    res.json({
      success: true,
      hasRegisteredKid: true,
      isApproved: child.status === "active",
      kidId: child._id,
      currentStatus: child.status,
      message:
        child.status === "pending"
          ? "Registration pending approval"
          : child.status === "active"
          ? "Registration approved"
          : "Account inactive",
    });
  } catch (error) {
    console.error("Error checking parent status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//     Submit admission form
export const submitAdmission = async (req, res) => {
  try {
    const parentId = req.user._id;
    const {
      // Child Info
      childName,
      dateOfBirth,
      gender,
      grade,
      // Parent Info
      fatherName,
      motherName,
      email,
      phone,
      alternatePhone,
      emergencyContact,
      address,
      // Medical
      bloodGroup,
      medicalInfo,
      height,
      weight,
      // Education
      previousSchool,
      // Documents (Cloudinary URLs)
      documents,
      // Additional
      annualIncome,
      religion,
      category,

      fatherOccupation,
      motherOccupation,
      parentName,
      guardianRelation,
    } = req.body;

    // Validate required fields
    if (!childName || !dateOfBirth || !gender || !grade) {
      return res.status(400).json({
        success: false,
        message: "Missing required child information",
      });
    }

    // Transform grade to lowercase to match schema
    const normalizedGrade = grade.toLowerCase();

    // Validate document URLs
    const requiredDocs = ["birthCertificate", "childPhoto", "parentAadhar"];
    for (const doc of requiredDocs) {
      if (!documents?.[doc]) {
        return res.status(400).json({
          success: false,
          message: `Missing required document: ${doc}`,
        });
      }
    }

    // Create student record
    const newStudent = await Student.create({
      parentId,
      name: childName,
      dob: dateOfBirth,
      gender,
      classInfo: {
        current: {
          name: normalizedGrade,
          classId: null,
          section: null,
          academicYear: new Date().getFullYear().toString(),
        },
      },
      parentDetails: {
        guardianName: parentName, // Add this
        relation: guardianRelation, // Add this
        fatherName,
        motherName,
        fatherOccupation, // Add this
        motherOccupation, // Add this
        primaryContact: phone,
        alternateContact: alternatePhone,
        emergencyContact,
        address,
        email,
      },
      medicalInfo: {
        bloodGroup,
        allergies: medicalInfo,
        height: Number(height),
        weight: Number(weight),
      },
      previousSchool,
      documents: {
        birthCertificate: documents.birthCertificate,
        aadharCard: documents.childAadhar,
        photo: documents.childPhoto,
        addressProof: documents.addressProof,
        parentAadhar: documents.parentAadhar,
      },
      status: "pending",
    });

    // Update parent's record
    await User.findByIdAndUpdate(parentId, {
      $push: { children: newStudent._id },
      $set: {
        "familyInfo.annualIncome": annualIncome,
        "familyInfo.religion": religion,
        "familyInfo.category": category,
        "familyInfo.fatherOccupation": fatherOccupation, // Add this
        "familyInfo.motherOccupation": motherOccupation, // Add this
      },
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "Admission submitted for review",
      data: {
        studentId: newStudent._id,
        nextStep: "/pending-approval",
      },
    });
  } catch (error) {
    console.error("Admission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
