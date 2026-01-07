import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import Fee from "../models/fee.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [students, teachers, pending] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments({ role: "teacher" }),
      Student.countDocuments({ status: "pending" }),
    ]);

    res.json({ success: true, data: { students, teachers, pending } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/adminController.js
export const getRecentActivity = async (req, res) => {
  try {
    // Get logs from multiple collections
    const [approvals, newTeachers, feeUpdates] = await Promise.all([
      Student.find({ status: "active" })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("name updatedAt"),
      User.find({ role: "teacher" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name createdAt"),
      Fee.find().sort({ updatedAt: -1 }).limit(5).populate("studentId", "name"),
    ]);

    const activityLog = [
      ...approvals.map((a) => ({
        type: "student_approval",
        message: `Approved student: ${a.name}`,
        timestamp: a.updatedAt,
      })),
      ...newTeachers.map((t) => ({
        type: "new_teacher",
        message: `New teacher added: ${t.name}`,
        timestamp: t.createdAt,
      })),
      ...feeUpdates.map((f) => ({
        type: "fee_update",
        message: `Fee updated for ${f.studentId.name}`,
        timestamp: f.updatedAt,
      })),
    ]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    res.json({
      success: true,
      data: activityLog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: err.message,
    });
  }
};
