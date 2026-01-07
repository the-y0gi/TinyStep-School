import express from "express";
import {
getParentStatus,
submitAdmission
} from "../controllers/student.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/parent/status",protect, getParentStatus);
router.post("/register",protect, submitAdmission);

export default router;
