import express from "express";
import { teacherLogin } from "../controllers/auth.controller.js";
import {
  getTeacherDashboard,
  getAssignedClasses,
  getStudentsOfClass,
  getClassDropdown,
  uploadStudentResult,
  getStudentsByClassId,
  sendNotification,
  getTeacherNotifications,
  updateNotification,
  deleteNotification,
  getClassRanking,
  downloadResult,
  getResults,
  getTeacherClasses,
  getStudentsForAttendance,
  submitAttendance,
  getAttendanceSummary,
  getTeachers
} from "../controllers/teacher.controller.js";

import {
  getTeacherProfile,
  updateTeacherProfile,
  changeTeacherPassword
} from "../controllers/auth.controller.js";

import { submitMonthlyAttendance } from "../controllers/attendance.controller.js";

import { isTeacher, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- AUTH ----------------
router.post("/login", teacherLogin);

router.get("/get-teacher", getTeachers);

// ---------------- Teacher Profile ----------------
router.get("/profile", protect, isTeacher,getTeacherProfile);
router.put("/profile/update", protect, isTeacher,updateTeacherProfile);
router.put("/profile/change-password", protect,isTeacher, changeTeacherPassword);


// ---------------- DASHBOARD ----------------
router.get("/dashboard", protect, isTeacher, getTeacherDashboard);

// ---------------- CLASSES ----------------
router.get("/classes", protect, isTeacher, getAssignedClasses);
router.get("/classes/dropdown", protect, isTeacher, getClassDropdown);
router.get(
  "/classes/:classId/students",
  protect,
  isTeacher,
  getStudentsOfClass
); 

// ---------------- STUDENTS ----------------
router.get("/students/:id", protect, isTeacher, getStudentsByClassId); // now safe after fixing above route

// ---------------- ATTENDANCE ----------------
router.post("/attendance/monthly", protect, isTeacher, submitMonthlyAttendance);

// ---------------- RESULTS ----------------
router.get("/ranking", protect, isTeacher, getClassRanking);

router.get("/results", protect, isTeacher, getResults);
router.get("/results/:id/download", protect, isTeacher, downloadResult);

router.post("/results/upload", protect, isTeacher, uploadStudentResult);

// ---------------- notification ----------------

router.get("/notifications", protect, isTeacher, getTeacherNotifications);

router.post("/notifications", protect, isTeacher, sendNotification);

router.put("/notifications/:id", protect, isTeacher, updateNotification);
router.delete("/notifications/:id", protect, isTeacher, deleteNotification);


// ---------------- Attendance  ----------------
router.get('/classes', protect, isTeacher, getTeacherClasses);
router.get('/students-for-attendance', protect, isTeacher, getStudentsForAttendance);
router.post('/submit-attendance', protect, isTeacher, submitAttendance);
router.get('/attendance-summary', protect, isTeacher, getAttendanceSummary);



export default router;
