import Class from "../models/class.model.js";
import Attendance from "../models/attendance.model.js";
import Result from "../models/result.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import pdfkit from "pdfkit";
import fs from "fs";

import bcrypt from "bcryptjs";
//POST-> Teacher Create
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, qualifications, phone } = req.body;

    const teacher = new User({
      personalInfo: {
        name,
        phone,
      },
      email,
      password: await bcrypt.hash(password, 10),
      role: "teacher",
      teacherDetails: {
        qualifications,
      },
    });

    await teacher.save();
    res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//GET -> Teacher Assign
export const assignClass = async (req, res) => {
  try {
    const { classId } = req.body;

    // 1. Update teacher's assignedClasses
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { "teacherDetails.assignedClasses": { classId } },
    });

    // 2. Update class's teacherId
    await Class.findByIdAndUpdate(classId, { teacherId: req.params.id });

    res.json({ success: true, message: "Class assigned successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//GET-> All teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .populate("teacherDetails.assignedClasses.classId", "name section");

    res.json({
      success: true,
      data: teachers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: err.message,
    });
  }
};

// //GET-> Assign class
export const assignClassToTeacher = async (req, res) => {
  try {
    const { id: teacherId } = req.params;
    const { classId } = req.body;

    // Step 1: Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Step 2: Find teacher
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Step 3: Ensure teacherDetails exists
    if (!teacher.teacherDetails) {
      teacher.teacherDetails = { assignedClasses: [] };
    }

    // Step 4: Check if class already assigned
    const alreadyAssigned = teacher.teacherDetails.assignedClasses.some(
      (c) => c.classId.toString() === classId
    );

    if (!alreadyAssigned) {
      teacher.teacherDetails.assignedClasses.push({ classId });
      await teacher.save();
    }

    // Step 5: Update class with teacherId
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { teacherId },
      { new: true }
    );

    res.json({
      success: true,
      val: updatedClass,
      message: "Class assigned successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Assignment failed",
      error: err.message,
    });
  }
};


//get teacher dashboard
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id; // from auth middleware

    // 1. Get all classes assigned to this teacher
    const classes = await Class.find({ teacherId }).populate("students");

    const classIds = classes.map((cls) => cls._id);
    const studentCount = classes.reduce(
      (total, cls) => total + (cls.students?.length || 0),
      0
    );

    // 2. Attendance pending (for current month)
    const currentMonth = new Date().getMonth() + 1; // 0-indexed
    const currentYear = new Date().getFullYear();

    const submittedAttendance = await Attendance.find({
      submittedBy: teacherId,
      month: currentMonth,
      year: currentYear,
    });

    const submittedClassIds = new Set(
      submittedAttendance.map((att) => att.classId.toString())
    );

    const pendingAttendance = classIds.filter(
      (cid) => !submittedClassIds.has(cid.toString())
    );

    // 3. Tests added this month
    const testsThisMonth = await Result.find({
      publishedBy: teacherId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    // 4. Recent activity (latest attendance/result)
    const recentAttendance = await Attendance.findOne({
      submittedBy: teacherId,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    const recentResult = await Result.findOne({
      publishedBy: teacherId,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    const latestActivity = [recentAttendance, recentResult]
      .filter(Boolean)
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    res.status(200).json({
      success: true,
      data: {
        totalStudents: studentCount,
        classesWithPendingAttendance: pendingAttendance.length,
        testsThisMonth: testsThisMonth.length,
        recentActivity: latestActivity
          ? {
              type: latestActivity.__t || latestActivity.constructor.modelName, // Changed from recentActivity to latestActivity
              date: latestActivity.createdAt,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Teacher Dashboard Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//student in class
export const getStudentsInClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findById(classId).populate("students");

    if (!cls) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    res.status(200).json({ success: true, students: cls.students });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching students" });
  }
};

//assign classes
export const getAssignedClasses = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const classIds =
      teacher.teacherDetails?.assignedClasses?.map((c) => c.classId) || [];

    const classes = await Class.find({ _id: { $in: classIds } });

    res.json({ success: true, classes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: err.message,
    });
  }
};

//student of class
export const getStudentsOfClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Validate classId
    if (!classId) {
      return res.status(400).json({ 
        success: false,
        message: "Class ID is required" 
      });
    }

    // Verify class exists and get class document
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ 
        success: false,
        message: "Class not found" 
      });
    }

    // Find students using both possible relationships
    const students = await Student.find({
      $or: [
        { "classInfo.current.classId": classId }, // Students with class in their info
        { _id: { $in: classDoc.students } }      // Students referenced in class
      ],
      status: "active" // Only active students
    })
    .select('_id name rollNo admissionNumber gender dob') // Essential fields
    .sort({ rollNo: 1 }) // Ordered by roll number
    .lean();

    // Return consistent response format
    res.json({
      success: true,
      count: students.length,
      class: {
        _id: classDoc._id,
        name: classDoc.name,
        section: classDoc.section
      },
      students
    });

  } catch (err) {
    console.error("Error in getStudentsOfClass:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
};

//class dropdown
export const getClassDropdown = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await Class.find({ teacherId })
      .select("name section") // Only fetch required fields
      .lean();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch class dropdown." });
  }
};

export const getStudentsByClassId = async (req, res) => {
  try {
    const classId = req.params.id;

    const students = await Student.find({ classId }); // or whatever your schema uses

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this class." });
    }

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const uploadStudentResult = async (req, res) => {
  try {
    const { classId, examType, examDate, subjects, results } = req.body;
    const submittedBy = req.user._id; // Using submittedBy to match schema

    // Validate all required fields
    if (!classId || !examType || !examDate || !subjects || !results) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided: classId, examType, examDate, subjects, results"
      });
    }

    // Validate subjects array
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects must be a non-empty array"
      });
    }

    // Validate results array
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Results must be a non-empty array"
      });
    }

    const createdResults = [];
    const errors = [];

    // Process each student result
    for (const [index, result] of results.entries()) {
      try {
        const { studentId, marksObtained, teacherRemarks = '' } = result;

        // Validate marks match subjects
        if (!marksObtained || marksObtained.length !== subjects.length) {
          errors.push({
            studentId,
            error: `Marks obtained must be provided for all ${subjects.length} subjects`
          });
          continue;
        }

        // Prepare subjects with calculated grades
        const processedSubjects = subjects.map((subject, i) => {
          const percentage = (marksObtained[i] / subject.maxMarks) * 100;
          return {
            name: subject.name,
            marksObtained: marksObtained[i],
            maxMarks: subject.maxMarks,
            grade: calculateGrade(percentage) // Implement your grade calculation
          };
        });

        // Calculate overall percentage
        const totalObtained = marksObtained.reduce((sum, mark) => sum + mark, 0);
        const totalMax = subjects.reduce((sum, subj) => sum + subj.maxMarks, 0);
        const overallPercentage = (totalObtained / totalMax) * 100;

        // Create result document
        const resultDoc = new Result({
          studentId,
          classId,
          examType,
          examDate,
          subjects: processedSubjects,
          teacherRemarks,
          percentage: parseFloat(overallPercentage.toFixed(2)),
          overallGrade: calculateGrade(overallPercentage),
          submittedBy,
          published: false
        });

        await resultDoc.save();
        createdResults.push(resultDoc);

      } catch (error) {
        errors.push({
          index,
          studentId: result.studentId,
          error: error.message
        });
      }
    }

    // Handle partial successes
    if (errors.length > 0) {
      return res.status(207).json({ // 207 Multi-Status
        success: true,
        message: "Some results were not saved",
        savedCount: createdResults.length,
        errorCount: errors.length,
        createdResults,
        errors
      });
    }

    return res.status(201).json({
      success: true,
      message: "All results uploaded successfully",
      count: createdResults.length,
      data: createdResults
    });

  } catch (error) {
    console.error("Result upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading results",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Example grade calculation function
function calculateGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export const sendNotification = async (req, res) => {
  try {
    const teacherId = req.user._id; // From auth middleware
    const { title, message, type, recipients } = req.body;

    if (!title || !message || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // Step 1: Get teacher's assigned class IDs
    const teacher = await User.findById(teacherId);
    const assignedClassIds = teacher.teacherDetails.assignedClasses.map((c) =>
      c.classId.toString()
    );

    let finalParentIds = new Set();

    // Step 2: If specificParents given
    if (recipients?.specificParents?.length > 0) {
      recipients.specificParents.forEach((pId) => finalParentIds.add(pId));
    }

    // Step 3: If classIds given
    if (recipients?.classIds?.length > 0) {
      for (const classId of recipients.classIds) {
        if (!assignedClassIds.includes(classId)) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized class access",
          });
        }

        const students = await Student.find({
          "classInfo.current.classId": classId,
        });
        students.forEach((s) => finalParentIds.add(s.parentId.toString()));
      }
    }

    // Step 4: If allParents true → use all assigned classes
    if (recipients?.allParents) {
      for (const classId of assignedClassIds) {
        const students = await Student.find({
          "classInfo.current.classId": classId,
        });
        students.forEach((s) => finalParentIds.add(s.parentId.toString()));
      }
    }

    // Step 5: Convert Set to array
    const uniqueParents = Array.from(finalParentIds);

    // Step 6: Save Notification
    const newNotification = await Notification.create({
      title,
      message,
      type,
      sentBy: teacherId,
      recipients: {
        allParents: recipients.allParents || false,
        specificParents: recipients.specificParents || [],
        classIds: recipients.classIds || [],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: {
        notification: newNotification,
        totalParents: uniqueParents.length,
      },
    });
  } catch (err) {
    console.error("Notification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/teacher/notifications
export const getTeacherNotifications = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const notifications = await Notification.find({ sentBy: teacherId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    console.error("Fetch teacher notifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/teacher/notifications/:id

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;
    const { title, message, type } = req.body;

    const notif = await Notification.findOne({ _id: id, createdBy: teacherId });
    if (!notif)
      return res
        .status(404)
        .json({
          success: false,
          message: "Notification not found or unauthorized",
        });

    notif.title = title || notif.title;
    notif.message = message || notif.message;
    notif.type = type || notif.type;

    await notif.save();

    res
      .status(200)
      .json({ success: true, message: "Notification updated", data: notif });
  } catch (error) {
    console.error("Update Notification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/teacher/notifications/:id

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    const notif = await Notification.findOne({ _id: id, createdBy: teacherId });
    if (!notif)
      return res
        .status(404)
        .json({
          success: false,
          message: "Notification not found or unauthorized",
        });

    await Notification.deleteOne({ _id: id });

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getClassRanking = async (req, res) => {
  try {
    const { classId, month } = req.query;

    // Validate inputs
    if (!classId || !month) {
      return res.status(400).json({
        success: false,
        message: "Both classId and month are required",
      });
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month format. Please use YYYY-MM",
      });
    }

    // Calculate date range for the month
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    // Fetch ALL results (including unpublished) with student details
    const results = await Result.find({
      classId,
      examDate: { $gte: startDate, $lt: endDate }
    })
      .populate("studentId", "name rollNumber")
      .lean();

    if (!results.length) {
      return res.status(200).json({
        success: true,
        message: "No results found for the selected period",
        data: [],
      });
    }

    // Calculate student totals
    const studentTotals = results.reduce((acc, result) => {
      const existingStudent = acc.find(
        (item) => item.student._id.toString() === result.studentId._id.toString()
      );

      const resultTotal = result.subjects.reduce(
        (sum, sub) => sum + sub.marksObtained,
        0
      );
      const resultMax = result.subjects.reduce(
        (sum, sub) => sum + sub.maxMarks,
        0
      );

      if (existingStudent) {
        existingStudent.totalMarks += resultTotal;
        existingStudent.maxTotal += resultMax;
      } else {
        acc.push({
          student: result.studentId,
          totalMarks: resultTotal,
          maxTotal: resultMax,
        });
      }

      return acc;
    }, []);

    // Calculate percentages
    const studentsWithPercentage = studentTotals.map((student) => ({
      ...student,
      percentage: ((student.totalMarks / student.maxTotal) * 100).toFixed(2),
    }));

    // Sort by total marks and assign ranks
    const rankedStudents = studentsWithPercentage
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));

    return res.status(200).json({
      success: true,
      message: "Rankings generated successfully",
      data: rankedStudents,
    });
  } catch (error) {
    console.error("Error generating ranking:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getResults = async (req, res) => {
  try {
    // Get teacher ID from auth middleware
    const teacherId = req.user.id;

    // Find all classes assigned to this teacher
    const teacherClasses = await Class.find({ teacherId });

    if (!teacherClasses || teacherClasses.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes assigned to this teacher" });
    }

    // Get results for these classes
    const results = await Result.find({
      classId: { $in: teacherClasses.map((c) => c._id) },
    })
      .populate({
        path: "classId",
        select: "name section",
      })
      .populate({
        path: "studentId",
        select: "name rollNumber",
      })
      .sort({ examDate: -1 });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//     Download result as PDF
export const downloadResult = async (req, res) => {
  try {
    const resultId = req.params.id;
    const teacherId = req.user.id;

    // Verify the result belongs to teacher's class
    const result = await Result.findById(resultId)
      .populate({
        path: "classId",
        select: "teacherId",
      })
      .populate({
        path: "studentId",
        select: "name rollNumber",
      });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Check if the teacher is assigned to this class
    if (result.classId.teacherId.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this result" });
    }

    // Create PDF
    const doc = new pdfkit();
    const filename = `Result_${result.studentId.rollNumber}_${result.examType}.pdf`;

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text("STUDENT RESULT", { align: "center" });
    doc.moveDown();

    // Student Info
    doc
      .fontSize(14)
      .text(
        `Student: ${result.studentId.name} (Roll No: ${result.studentId.rollNumber})`
      );
    doc.text(
      `Class: ${result.classId.name} - Section ${result.classId.section}`
    );
    doc.text(`Exam: ${result.examType} - ${result.examDate.toDateString()}`);
    doc.moveDown();

    // Subjects Table
    const table = {
      headers: ["Subject", "Marks Obtained", "Max Marks", "Grade"],
      rows: result.subjects.map((sub) => [
        sub.name,
        sub.marksObtained.toString(),
        sub.maxMarks.toString(),
        sub.grade || "-",
      ]),
    };

    // Draw table
    doc.font("Helvetica-Bold");
    doc.fontSize(12);
    table.headers.forEach((header, i) => {
      doc.text(header, 50 + i * 150, doc.y, { width: 150 });
    });
    doc.moveDown();

    doc.font("Helvetica");
    table.rows.forEach((row) => {
      row.forEach((cell, i) => {
        doc.text(cell, 50 + i * 150, doc.y, { width: 150 });
      });
      doc.moveDown();
    });

    // Total and Remarks
    doc.moveDown();
    doc.font("Helvetica-Bold").text("Teacher Remarks:");
    doc.font("Helvetica").text(result.teacherRemarks || "No remarks");

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating result PDF" });
  }
};

// ---------------- Attendance  ----------------

//get teacher class
export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Verify the user is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({
          message: "Access denied. Only teachers can view assigned classes.",
        });
    }

    // Get classes assigned to this teacher
    const classes = await Class.find({ teacherId })
      .select("_id name section academicYear")
      .lean();

    res.json(classes);
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    res.status(500).json({ message: "Server error while fetching classes" });
  }
};


export const getStudentsForAttendance = async (req, res) => {
  try {
    const { classId, month, year } = req.query;

    if (!classId || !month || !year) {
      return res
        .status(400)
        .json({ message: "Class ID, month, and year are required" });
    }

    // Get class document first
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find students - try both methods
    const students = await Student.find({
      $or: [
        { "classInfo.current.classId": classId },
        { _id: { $in: classDoc.students } },
      ],
      status: "active",
    })
      .select("_id name rollNumber")
      .sort("name")
      .lean();

    // Rest of your existing code...
    const attendanceRecords = await Attendance.find({
      classId,
      month: parseInt(month),
      year: parseInt(year),
      studentId: { $in: students.map((s) => s._id) },
    }).lean();

    const studentsWithAttendance = students.map((student) => {
      const existingRecord = attendanceRecords.find((r) =>
        r.studentId.equals(student._id)
      );
      return {
        ...student,
        existingAttendance: existingRecord || null,
      };
    });

    const schoolDays = attendanceRecords[0]?.totalSchoolDays || 0;

    res.json({
      students: studentsWithAttendance,
      schoolDays,
    });
  } catch (error) {
    console.error("Error fetching students for attendance:", error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// Submit Attendance
export const submitAttendance = async (req, res) => {
  try {
    const { classId, month, year, attendanceRecords } = req.body;
    const submittedBy = req.user._id;

    // Validate input
    if (!classId || !month || !year || !attendanceRecords?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get total school days from first record (all should have same value)
    const totalSchoolDays = attendanceRecords[0].totalSchoolDays;

    // Prepare bulk write operations
    const operations = attendanceRecords.map((record) => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          classId,
          month: parseInt(month),
          year: parseInt(year),
        },
        update: {
          $set: {
            presentDays: record.presentDays,
            totalSchoolDays,
            submittedBy,
          },
        },
        upsert: true,
      },
    }));

    // Execute bulk write
    await Attendance.bulkWrite(operations);

    res.json({ message: "Attendance submitted successfully" });
  } catch (error) {
    console.error("Error submitting attendance:", error);
    res
      .status(500)
      .json({ message: "Server error while submitting attendance" });
  }
};

//Get Attendance Summary
export const getAttendanceSummary = async (req, res) => {
  try {
    const { classId, month, year } = req.query;

    // Validate input
    if (!classId || !month || !year) {
      return res
        .status(400)
        .json({ message: "Class ID, month, and year are required" });
    }

    // Get attendance records for the class in specified month/year
    const attendance = await Attendance.find({
      classId,
      month: parseInt(month),
      year: parseInt(year),
    })
      .populate({
        path: "studentId",
        select: "name rollNumber",
      })
      .lean();

    // Get total school days (from first record, all should have same value)
    const schoolDays = attendance[0]?.totalSchoolDays || 0;

    // Format response
    const formattedAttendance = attendance.map((record) => ({
      _id: record.studentId._id,
      name: record.studentId.name,
      rollNumber: record.studentId.rollNumber,
      presentDays: record.presentDays,
      percentage:
        schoolDays > 0
          ? Math.round((record.presentDays / schoolDays) * 100)
          : 0,
    }));

    res.json({
      attendance: formattedAttendance,
      schoolDays,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching attendance summary" });
  }
};


export const getTeachers = async (req, res) => {
  try {
    // Find all users with role "teacher" and select only necessary fields
    const teachers = await User.find({ role: "teacher" })
      .select("personalInfo teacherDetails")
      .lean(); // Convert to plain JS object
    
    // Format the response
    const formattedTeachers = teachers.map(teacher => ({
      id: teacher._id,
      name: teacher.personalInfo.name,
      title: "Teacher",
      image: teacher.personalInfo.profileImage || "/api/placeholder/220/280",
      hasImage: !!teacher.personalInfo.profileImage,
      qualifications: teacher.teacherDetails?.qualifications || "Not specified"
    }));

    res.status(200).json(formattedTeachers);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching teachers", 
      error: error.message 
    });
  }
};
