import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadFile, deleteFile } from '../controllers/upload.controller.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('file'), uploadFile);

router.route('/:publicId')
  .delete(protect, deleteFile);

export default router;