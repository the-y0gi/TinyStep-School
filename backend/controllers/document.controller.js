// controllers/documentController.js
import Student from '../models/student.model';
import { NotFoundError, BadRequestError } from '../middlewares/errorHandler.js';
import path from 'path';
import fs from 'fs/promises';

// Download student document
export const downloadStudentDocument = async (req, res) => {
  const { studentId, docType } = req.params;

  // Validate document type
  const validDocTypes = ['birthCertificate', 'childPhoto', 'childAadhar', 'parentAadhar', 'addressProof'];
  if (!validDocTypes.includes(docType)) {
    throw new BadRequestError('Invalid document type');
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const filePath = student.documents?.[docType];
  if (!filePath) {
    throw new NotFoundError('Document not found');
  }

  // Construct absolute path
  const absolutePath = path.join(process.cwd(), filePath);

  try {
    // Check if file exists
    await fs.access(absolutePath);

    // Determine content type
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    }

    // Set headers and send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(absolutePath)}"`);
    
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('File access error:', err);
    throw new NotFoundError('Document file not found');
  }
};