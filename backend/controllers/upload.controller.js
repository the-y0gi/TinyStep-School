import cloudinary from '../config/cloudinary.js';
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Normalize file path for Windows
    const filePath = req.file.path.replace(/\\/g, '/');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'school-admissions',
      resource_type: 'auto',
      quality: 'auto:good'
    });

    // Delete temp file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format
    });

  } catch (error) {
    // Delete temp file if upload failed
    if (req.file?.path) {
      const filePath = req.file.path.replace(/\\/g, '/');
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
};
//     Delete file from Cloudinary
export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
};