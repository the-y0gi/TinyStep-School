
import Attendance from "../models/attendance.model.js";

export const submitMonthlyAttendance = async (req, res) => {
  try {
    const { classId, month, year, totalSchoolDays, attendance } = req.body;
    const teacherId = req.user._id;

    if (!classId || !month || !year || !totalSchoolDays || !attendance) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const attendanceRecords = attendance.map((entry) => ({
      studentId: entry.studentId,
      classId,
      month,
      year,
      totalSchoolDays,
      presentDays: entry.presentDays,
      submittedBy: teacherId,
    }));

    // Use insertMany with { ordered: false } to allow partial success
    const saved = await Attendance.insertMany(attendanceRecords, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      message: `${saved.length} attendance records submitted.`,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error from unique index (studentId + classId + month + year)
      return res.status(409).json({
        success: false,
        message: "Some attendance records already exist.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not save attendance.",
    });
  }
};
