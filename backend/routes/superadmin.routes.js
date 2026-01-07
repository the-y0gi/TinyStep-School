import express from 'express';
import {
  createClass,
  addStudentsToClass,
  getClassDetails,
  getAllClasses,
  updateClass,
  removeStudentFromClass
} from '../controllers/superadmin.controller.js';

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Class Management Routes
router.post('/',authMiddleware, createClass);
router.get('/', authMiddleware,getAllClasses);
router.get('/:classId', authMiddleware,getClassDetails);
router.put('/:classId',authMiddleware, updateClass);

// Student Assignment Routes
router.post('/:classId/students', authMiddleware,addStudentsToClass);
router.delete('/:classId/students/:studentId',authMiddleware, removeStudentFromClass);

export default router;