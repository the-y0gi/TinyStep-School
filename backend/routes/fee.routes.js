import express from 'express';
import {
  getStudentFeeDetails,
  initiatePayment,
  verifyPayment,
  generateReceipt
} from '../controllers/payment.controller.js';

import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Student Fee Dashboard
router.get('/students/:studentId/fees', getStudentFeeDetails);

// Payment Flow
router.post('/payments/initiate',initiatePayment);
router.post('/payments/verify/:studentId',  verifyPayment);
router.get('/receipts/:paymentId', generateReceipt);

export default router;