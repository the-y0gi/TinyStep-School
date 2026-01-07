import Student from "../models/student.model.js";
import Fee from "../models/fee.model.js";
import Result from "../models/result.model.js";
import Attendance from "../models/attendance.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

//Get student profile
//WORKING H YEH CONTROLLER
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate(
        "parentId",
        "personalInfo.name personalInfo.phone personalInfo.address"
      )
      .populate("classInfo.current.classId", "name section academicYear");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!student.classInfo?.current?.classId) {
    }
    // Validate critical fields
    if (
      !student.parentDetails?.fatherName ||
      !student.parentDetails?.primaryContact
    ) {
      return res.status(400).json({ error: "Essential student data missing" });
    }

 
    // Structured response
    const response = {
      id: student._id,
      name: student.name,
      class: student.classInfo.current?.classId?.name || "Not assigned",
      batch: student.classInfo.current?.academicYear || "2025",
      currentSession: new Date().getFullYear().toString(),
      fatherName: student.parentDetails.fatherName,
      motherName: student.parentDetails.motherName || "",
      phone: student.parentDetails.primaryContact,
      email: student.parentDetails.email || "",
      address: student.parentId.personalInfo.address || "",
      profileImage: student.documents?.photo || null,
    };


    res.json(response);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Server error" });
  }
};



//  Get attendance for a student (current & previous month)
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get current date details
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    // Calculate previous month (handle year change)
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    // Fetch attendance data
    const [currentMonthData, previousMonthData] = await Promise.all([
      Attendance.findOne({
        studentId,
        month: currentMonth,
        year: currentYear,
      }),
      Attendance.findOne({
        studentId,
        month: prevMonth,
        year: prevYear,
      }),
    ]);

    // Format response
    const response = {
      currentMonth: currentMonthData
        ? formatAttendance(currentMonthData, currentMonth, currentYear)
        : createEmptyAttendance(currentMonth, currentYear),
      previousMonth: previousMonthData
        ? formatAttendance(previousMonthData, prevMonth, prevYear)
        : createEmptyAttendance(prevMonth, prevYear),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper functions
const formatAttendance = (attendance, month, year) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    month: monthNames[month - 1],
    year,
    totalDays: attendance.totalSchoolDays,
    presentDays: attendance.presentDays,
    absentDays: attendance.totalSchoolDays - attendance.presentDays,
    percentage: Math.round(
      (attendance.presentDays / attendance.totalSchoolDays) * 100
    ),
  };
};

const createEmptyAttendance = (month, year) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    month: monthNames[month - 1],
    year,
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0,
  };
};

//  Get student profile for tracking
export const getStudentForTracking = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate("classInfo.current.classId", "name section teacherId")
      .populate({
        path: "classInfo.current.classId",
        populate: {
          path: "teacherId",
          select: "personalInfo.name",
        },
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Format response
    const response = {
      id: student._id,
      name: student.name,
      nickname: student.name.split(" ")[0], // First name as nickname
      age: calculateAge(student.dob),
      class: student.classInfo.current?.classId?.name || "Not Assigned",
      section: student.classInfo.current?.section || "",
      profileImage: student.documents?.photo || null,
      parentName: student.parentDetails?.fatherName || "",
      teacherName:
        student.classInfo.current?.classId?.teacherId?.personalInfo?.name ||
        "Not Assigned",
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper function
const calculateAge = (dob) => {
  if (!dob) return 0;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

//     Get notifications for a student's parent
export const getStudentNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    // Get parent ID from student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find notifications where:
    // 1. Sent to all parents OR
    // 2. Sent to specific parent OR
    // 3. Sent to student's class
    const notifications = await Notification.find({
      $or: [
        { "recipients.allParents": true },
        { "recipients.specificParents": student.parentId },
        { "recipients.classIds": student.classInfo.current?.classId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sentBy", "personalInfo.name role");

    // Format response
    const formattedNotifications = notifications.map((notif) => {
      const types = {
        general: { icon: "📢", color: "bg-blue-100 border-blue-300" },
        fee: { icon: "💰", color: "bg-green-100 border-green-300" },
        attendance: { icon: "📅", color: "bg-purple-100 border-purple-300" },
        event: { icon: "🎉", color: "bg-yellow-100 border-yellow-300" },
      };

      return {
        id: notif._id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        time: formatTime(notif.createdAt),
        icon: types[notif.type]?.icon || "ℹ️",
        color: types[notif.type]?.color || "bg-gray-100 border-gray-300",
        sentBy: notif.sentBy?.personalInfo?.name || "System",
      };
    });

    res.json(formattedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper function
const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
  return `${Math.floor(diff / day)} days ago`;
};

// ---------------- RESULTS Page  ----------------

// Get teacher details for report card
export const getTeacherForReport = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select(
      "personalInfo.name qualifications"
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      name: teacher.personalInfo.name,
      qualifications: teacher.qualifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAttendanceForReport = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;

    // If month and year are provided, get specific attendance
    // Otherwise get the latest attendance
    const query = { studentId };
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const attendance = await Attendance.findOne(query)
      .sort({ year: -1, month: -1 })
      .populate({
        path: "classId",
        select: "name section academicYear",
      })
      .populate({
        path: "submittedBy",
        select: "personalInfo.name",
      });

    if (!attendance) {
      return res.status(404).json({
        message:
          month && year
            ? `Attendance record not found for ${month}/${year}`
            : "No attendance records found",
      });
    }

    const response = {
      id: attendance._id,
      studentId: attendance.studentId,
      classInfo: {
        name: attendance.classId.name,
        section: attendance.classId.section,
        academicYear: attendance.classId.academicYear,
      },
      month: attendance.month,
      year: attendance.year,
      presentDays: attendance.presentDays,
      totalSchoolDays: attendance.totalSchoolDays,
      attendancePercentage: Math.round(
        (attendance.presentDays / attendance.totalSchoolDays) * 100
      ),
      submittedBy: attendance.submittedBy?.personalInfo?.name || "Unknown",
      submittedAt: attendance.createdAt,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getAttendanceForReport:", error);
    res.status(500).json({
      message: "Error fetching attendance record",
      error: error.message,
    });
  }
};

export const getResultForReport = async (req, res) => {
  try {
    const { studentId, examType } = req.params;

    const query = {
      studentId,
    };
    if (examType) {
      query.examType = examType;
    }

    const result = await Result.findOne(query)
      .sort({ examDate: -1 })
      .populate({
        path: "classId",
        select: "name section academicYear",
      })
      .populate({
        path: "submittedBy",
        select: "personalInfo.name role",
      });

    if (!result) {
      return res.status(404).json({
        message: examType
          ? `No ${examType} results found`
          : "No results found for this student",
      });
    }

    // Calculate class rank (now including unpublished results)
    const classResults = await Result.find({
      classId: result.classId,
      examType: result.examType,
    }).lean();

    const studentsWithPercentages = classResults
      .map((res) => {
        const total = res.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
        const obtained = res.subjects.reduce(
          (sum, sub) => sum + sub.marksObtained,
          0
        );
        return {
          studentId: res.studentId.toString(),
          percentage: Math.round((obtained / total) * 100),
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    const rank =
      studentsWithPercentages.findIndex(
        (s) => s.studentId === studentId.toString()
      ) + 1;

    const response = {
      id: result._id,
      studentId: result.studentId,
      examType: result.examType,
      examDate: result.examDate,
      classInfo: {
        name: result.classId.name,
        section: result.classId.section,
        academicYear: result.classId.academicYear,
      },
      subjects: result.subjects.map((subject) => ({
        name: subject.name,
        marksObtained: subject.marksObtained,
        maxMarks: subject.maxMarks,
        percentage: Math.round(
          (subject.marksObtained / subject.maxMarks) * 100
        ),
        grade: subject.grade,
      })),
      overall: {
        totalMarks: result.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0),
        obtainedMarks: result.subjects.reduce(
          (sum, sub) => sum + sub.marksObtained,
          0
        ),
        percentage: result.percentage,
        grade: result.overallGrade,
        rank: rank,
        classStrength: classResults.length,
      },
      remarks: result.teacherRemarks,
      submittedBy: result.submittedBy?.personalInfo?.name || "Unknown",
      submittedAt: result.createdAt,
      isPublished: result.published || false,
      publishedBy: result.published
        ? result.publishedBy?.personalInfo?.name || "Unknown"
        : null,
      publishedAt: result.published ? result.updatedAt : null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getResultForReport:", error);
    res.status(500).json({
      message: "Error fetching result",
      error: error.message,
    });
  }
};

export const getStudentRank = async (req, res) => {
  try {
    const { classId, studentId, examType } = req.params;

    // Get all results for the class (no published check)
    const results = await Result.find({
      classId,
      ...(examType && { examType }),
    }).populate("studentId", "name");

    if (results.length === 0) {
      return res.status(404).json({
        message: examType
          ? `No ${examType} results found for this class`
          : "No results found for this class",
      });
    }

    // Calculate percentages and sort
    const studentsWithPercentages = results.map((result) => {
      const total = result.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
      const obtained = result.subjects.reduce(
        (sum, sub) => sum + sub.marksObtained,
        0
      );
      return {
        studentId: result.studentId._id.toString(),
        studentName: result.studentId.name,
        percentage: Math.round((obtained / total) * 100),
        examType: result.examType,
        isPublished: result.published || false,
      };
    });

    // Sort by percentage (descending)
    studentsWithPercentages.sort((a, b) => b.percentage - a.percentage);

    // Find rank of requested student
    const studentIndex = studentsWithPercentages.findIndex(
      (s) => s.studentId === studentId
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        message: "Student not found in results",
      });
    }

    const rank = studentIndex + 1;
    const totalStudents = studentsWithPercentages.length;
    const percentile = Math.round(
      ((totalStudents - rank) / totalStudents) * 100
    );

    res.status(200).json({
      rank,
      totalStudents,
      percentile,
      studentName: studentsWithPercentages[studentIndex].studentName,
      percentage: studentsWithPercentages[studentIndex].percentage,
      examType: studentsWithPercentages[studentIndex].examType,
      isPublished: studentsWithPercentages[studentIndex].isPublished,
    });
  } catch (error) {
    console.error("Error in getStudentRank:", error);
    res.status(500).json({
      message: "Error calculating student rank",
      error: error.message,
    });
  }
};

export const getStudentReportCard = async (req, res) => {
  try {
    // Validate student ID parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await Student.findById(req.params.id)
      .populate({
        path: "classInfo.current.classId",
        model: "Class",
        select: "name section academicYear teacherId feeStructure",
        populate: {
          path: "teacherId",
          model: "User",
          select: "personalInfo.name",
        },
      })
      .populate({
        path: "parentId",
        model: "User",
        select: "personalInfo familyInfo",
      })
      .lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Safely extract class information with fallbacks
    const classCurrent = student.classInfo?.current || {};
    const classIdInfo = classCurrent.classId || {};
    const teacherInfo = classIdInfo.teacherId?.personalInfo || {};

    // Get latest attendance
    const attendance = await Attendance.findOne({
      studentId: student._id,
    })
      .sort({ year: -1, month: -1 })
      .limit(1);

    // Get latest result
    const result = await Result.findOne({
      studentId: student._id,
    })
      .sort({ examDate: -1 })
      .lean();

    // Calculate class rank if result exists
    let rank = null;
    if (result?.classId && result?.examType) {
      try {
        const classResults = await Result.find({
          classId: result.classId,
          examType: result.examType,
        }).lean();

        const studentsWithPercentages = classResults
          .map((res) => {
            const total = res.subjects.reduce(
              (sum, sub) => sum + sub.maxMarks,
              0
            );
            const obtained = res.subjects.reduce(
              (sum, sub) => sum + sub.marksObtained,
              0
            );
            return {
              studentId: res.studentId.toString(),
              percentage: Math.round((obtained / total) * 100),
            };
          })
          .sort((a, b) => b.percentage - a.percentage);

        rank =
          studentsWithPercentages.findIndex(
            (s) => s.studentId === student._id.toString()
          ) + 1;
      } catch (rankError) {
        console.error("Error calculating rank:", rankError);
        // Continue without rank data
      }
    }

    // Format the response with comprehensive fallbacks
    const response = {
      studentInfo: {
        id: student._id,
        name: student.name || "Unknown",
        dob: student.dob || null,
        gender: student.gender || "Not specified",
        profileImage: student.documents?.photo || null,
        medicalInfo: {
          bloodGroup: student.medicalInfo?.bloodGroup || "Not specified",
          allergies: student.medicalInfo?.allergies || "None reported",
          specialNeeds: student.medicalInfo?.specialNeeds || "None reported",
          height: student.medicalInfo?.height || null,
          weight: student.medicalInfo?.weight || null,
        },
      },
      classInfo: {
        name: classCurrent.name || classIdInfo.name || "Not assigned",
        section: classCurrent.section || classIdInfo.section || "N/A",
        academicYear:
          classCurrent.academicYear || classIdInfo.academicYear || "N/A",
        teacher: teacherInfo.name || "Not assigned",
        feeStructure: classIdInfo.feeStructure || {
          annualFee: 0,
          tuitionFee: 0,
          admissionFee: 0,
          otherCharges: 0,
        },
        classId: classCurrent.classId || null,
      },
      parentInfo: {
        fatherName: student.parentDetails?.fatherName || "Not specified",
        motherName: student.parentDetails?.motherName || "Not specified",
        guardianName: student.parentDetails?.guardianName || null,
        relation: student.parentDetails?.relation || null,
        contact: student.parentDetails?.primaryContact || "Not specified",
        alternateContact: student.parentDetails?.alternateContact || null,
        emergencyContact: student.parentDetails?.emergencyContact || null,
        email: student.parentDetails?.email || null,
        address: student.parentDetails?.address || "Not specified",
        fatherOccupation: student.parentDetails?.fatherOccupation || null,
        motherOccupation: student.parentDetails?.motherOccupation || null,
        ...(student.parentId?.personalInfo || {}),
        ...(student.parentId?.familyInfo || {}),
      },
      academicInfo: {
        attendance: attendance
          ? {
              present: attendance.presentDays || 0,
              total: attendance.totalSchoolDays || 0,
              percentage: attendance.totalSchoolDays
                ? Math.round(
                    (attendance.presentDays / attendance.totalSchoolDays) * 100
                  )
                : 0,
            }
          : null,
        result: result
          ? {
              examType: result.examType || "Standard",
              examDate: result.examDate || null,
              subjects:
                result.subjects?.map((subject) => ({
                  name: subject.name || "Unnamed Subject",
                  marksObtained: subject.marksObtained || 0,
                  maxMarks: subject.maxMarks || 100,
                  percentage: subject.maxMarks
                    ? Math.round(
                        (subject.marksObtained / subject.maxMarks) * 100
                      )
                    : 0,
                  grade: subject.grade || "N/A",
                })) || [],
              percentage:
                result.percentage ||
                (result.subjects?.length
                  ? Math.round(
                      (result.subjects.reduce(
                        (sum, sub) => sum + (sub.marksObtained || 0),
                        0
                      ) /
                        result.subjects.reduce(
                          (sum, sub) => sum + (sub.maxMarks || 100),
                          0
                        )) *
                        100
                    )
                  : 0),
              overallGrade: result.overallGrade || "N/A",
              rank: rank,
              isPublished: result.published || false,
            }
          : null,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getStudentReportCard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student report card",
      error: error.message,
    });
  }
};

//   try {
//     const student = await Student.findById(req.params.id)
//       .populate({
//         path: 'classInfo.current.classId',
//         model: 'Class',
//         select: 'name section academicYear teacherId feeStructure',
//         populate: {
//           path: 'teacherId',
//           model: 'User',
//           select: 'personalInfo.name'
//         }
//       })
//       .populate({
//         path: 'parentId',
//         model: 'User',
//         select: 'personalInfo familyInfo'
//       })
//       .lean();

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Get latest attendance
//     const attendance = await Attendance.findOne({
//       studentId: student._id
//     }).sort({ year: -1, month: -1 }).limit(1);

//     // Get latest result (no published check)
//     const result = await Result.findOne({
//       studentId: student._id
//     }).sort({ examDate: -1 });

//     // Calculate class rank if result exists (including unpublished results)
//     let rank = null;
//     if (result) {
//       const classResults = await Result.find({
//         classId: result.classId,
//         examType: result.examType
//       }).lean();

//       const studentsWithPercentages = classResults.map(res => {
//         const total = res.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
//         const obtained = res.subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
//         return {
//           studentId: res.studentId.toString(),
//           percentage: Math.round((obtained / total) * 100)
//         };
//       }).sort((a, b) => b.percentage - a.percentage);

//       rank = studentsWithPercentages.findIndex(
//         s => s.studentId === student._id.toString()
//       ) + 1;
//     }

//     // Format the complete response
//     const response = {
//       studentInfo: {
//         id: student._id,
//         name: student.name,
//         dob: student.dob,
//         gender: student.gender,
//         profileImage: student.documents?.photo,
//         medicalInfo: student.medicalInfo || {}
//       },
//       classInfo: {
//         name: student.classInfo?.current?.name || student.classInfo?.current?.classId?.name,
//         section: student.classInfo?.current?.section || student.classInfo?.current?.classId?.section,
//         academicYear: student.classInfo?.current?.academicYear || student.classInfo?.current?.classId?.academicYear,
//         teacher: student.classInfo?.current?.classId?.teacherId?.personalInfo?.name || 'Not assigned',
//         feeStructure: student.classInfo?.current?.classId?.feeStructure || {}
//       },
//       parentInfo: {
//         fatherName: student.parentDetails?.fatherName,
//         motherName: student.parentDetails?.motherName,
//         contact: student.parentDetails?.primaryContact,
//         email: student.parentDetails?.email,
//         address: student.parentDetails?.address,
//         ...(student.parentId?.personalInfo || {}),
//         ...(student.parentId?.familyInfo || {})
//       },
//       academicInfo: {
//         attendance: attendance ? {
//           present: attendance.presentDays,
//           total: attendance.totalSchoolDays,
//           percentage: Math.round((attendance.presentDays / attendance.totalSchoolDays) * 100)
//         } : null,
//         result: result ? {
//           examType: result.examType,
//           examDate: result.examDate,
//           subjects: result.subjects,
//           percentage: result.percentage,
//           overallGrade: result.overallGrade,
//           rank: rank,
//           isPublished: result.published || false
//         } : null
//       }
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error in getStudentReportCard:', error);
//     res.status(500).json({
//       message: 'Error fetching student report card',
//       error: error.message
//     });
//   }
// };
