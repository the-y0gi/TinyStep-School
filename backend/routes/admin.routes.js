import express from "express";
import { login, getProfile } from "../controllers/auth.controller.js";

import {
  getDashboardStats,
  getRecentActivity,
} from "../controllers/admin.controller.js";

import {
  getPendingStudents,
  approveStudent,
  rejectStudent,
  getAllStudents,
  getStudentDetails,
  downloadStudentDocument,
  assignClass,
} from "../controllers/student.controller.js";

import {
  getAllTeachers,
  createTeacher,
  assignClassToTeacher,
} from "../controllers/teacher.controller.js";

import {
  getAllClasses,
  getClassDetails,
  createClass,
  addStudentsToClass,
} from "../controllers/class.controller.js";

import {
  getAllFees,
  getFeeSummary,
  sendFeeReminder,
  setClassFees,
  editClassFees,
  addOneTimeFee,
  getOverdueFees,
  getOneTimeFees,
  getClassFeeStructure
} from "../controllers/fee.controller.js";

import {
  createNotification,
  getNotifications,
  sendNotification,
} from "../controllers/notification.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Authentication Routes
router.post("/auth/login", login);
router.get("/auth/profile", authMiddleware, getProfile);
// router.post('/auth/logout', authMiddleware, logout);

// 2. Dashboard Routes
router.get("/dashboard/stats", authMiddleware, getDashboardStats);
router.get("/dashboard/activity", authMiddleware, getRecentActivity);

// 3. Student Management
router.get("/students/pending", authMiddleware, getPendingStudents);
router.get("/students/details/:id", authMiddleware, getStudentDetails);
router.get(
  "/students/:studentId/documents/:docType",
  authMiddleware,
  downloadStudentDocument
);
router.post("/students/approve/:id", authMiddleware, approveStudent);
router.post("/students/reject/:id", authMiddleware, rejectStudent);
router.get("/students", authMiddleware, getAllStudents);
router.patch("/students/:studentId/assign-class", authMiddleware, assignClass);

// 4. Teacher Management
router.get("/teachers", authMiddleware, getAllTeachers);
router.post("/teachers", authMiddleware, createTeacher);
router.post("/teachers/:id/assign-class", authMiddleware, assignClassToTeacher);

// 5. Class Management
router.get("/classes", authMiddleware, getAllClasses);

router.get('/classes-details/:id', authMiddleware, getClassDetails);

router.post("/classes/create", authMiddleware, createClass);
router.post("/classes/:id/students", authMiddleware, addStudentsToClass);


// 6. Fee Management
router.get("/fees", authMiddleware, getAllFees);

router.get("/get-fees", authMiddleware, getFeeSummary);
router.get("/fees/one-time-fees", authMiddleware,getOneTimeFees); // Add event fees
router.get("/fees/get-class-fees", authMiddleware,getClassFeeStructure);

router.post("/fees/set-class-fees", authMiddleware,setClassFees);
router.post("/fees/edit-class-fees", authMiddleware,editClassFees );

router.post("/fees/add-one-time-fee", authMiddleware,addOneTimeFee); 
// router.get("/fees/overdue-fees",authMiddleware, getOverdueFees); // Track overdue payments
// router.post("/fees/reminder", authMiddleware, sendFeeReminder);

// 7. Notification System
router.post("/notifications", authMiddleware, createNotification);
router.post('/notifications/send', authMiddleware, sendNotification);

router.get("/notifications/get", authMiddleware, getNotifications);

export default router;
