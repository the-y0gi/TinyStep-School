import express from 'express';
import {
  getStudentAttendance,
  getStudentProfile,
  getStudentForTracking,
  getStudentNotifications,
  getStudentReportCard,
  getAttendanceForReport,
  getResultForReport,
  getStudentRank,
  getTeacherForReport
} from '../controllers/studentDashboard.controller.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Main dashboard endpoint
router.get('/:id', getStudentProfile);
// Attendance routes
router.get('/attendance/:studentId', getStudentAttendance);

// Student routes
router.get('/students/tracking/:studentId', getStudentForTracking);

// Notification routes
router.get('/notifications/student/:studentId', getStudentNotifications);

// ---------------- RESULTS Page  ----------------
router.get('/students/:id/report-card', getStudentReportCard);
router.get('/attendance/report/:studentId', getAttendanceForReport);
router.get('/results/report/:studentId', getResultForReport);
router.get('/classes/:classId/rank/:studentId', getStudentRank);


router.get('/:id', getTeacherForReport);


export default router;