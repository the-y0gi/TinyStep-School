import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Upload,
  FileText,
  User,
  Calendar,
  Home,
  School,
  X,
  Eye,
} from "lucide-react";
import axios from "axios";
import axiosInstance from "../services/axiosConfig";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    parentName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    previousSchool: "",
    medicalInfo: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    annualIncome: "",
    religion: "",
    category: "",
    bloodGroup: "",
    height: "",
    weight: "",
    guardianRelation: "",
    alternatePhone: "",
  });

  const [documents, setDocuments] = useState({
    birthCertificate: null,
    childPhoto: null,
    childAadhar: null,
    parentAadhar: null,
    addressProof: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    birthCertificate: null,
    childPhoto: null,
    childAadhar: null,
    parentAadhar: null,
    addressProof: null,
  });

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate date of birth (child should be <= 6 years old)
  const validateDOB = (dateString) => {
    const dob = new Date(dateString);
    const today = new Date();
    const ageInMilliseconds = today - dob;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    return ageInYears >= 2 && ageInYears <= 6; // 2-6 years old
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload file to Cloudinary

  const uploadFileToCloudinary = async (file, docType) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Field name must match multer's .single('file')

      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            [docType]: percentCompleted,
          }));
        },
      });

      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and PDF files are allowed");
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        [docType]: url,
      }));

      // Store file temporarily
      setDocuments((prev) => ({
        ...prev,
        [docType]: file,
      }));

      // Upload to Cloudinary
      const uploadResponse = await uploadFileToCloudinary(file, docType);

      // Update documents state with Cloudinary response
      setDocuments((prev) => ({
        ...prev,
        [docType]: {
          file, // original file object
          url: uploadResponse.url,
          publicId: uploadResponse.publicId,
          format: uploadResponse.format,
        },
      }));

      toast.success(
        `${docType.replace(/([A-Z])/g, " $1")} uploaded successfully!`
      );
    } catch (error) {
      toast.error(`Failed to upload ${docType.replace(/([A-Z])/g, " $1")}`);
      // Remove the file if upload fails
      handleFileRemove(docType);
    } finally {
      setUploadProgress((prev) => ({
        ...prev,
        [docType]: 0,
      }));
    }
  };

  const handleFileRemove = async (docType) => {
    try {
      const document = documents[docType];

      // If file was uploaded to Cloudinary, delete it
      if (document?.publicId) {
        await axiosInstance.delete(`/upload/${document.publicId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      // Revoke the preview URL
      if (previewUrls[docType]) {
        URL.revokeObjectURL(previewUrls[docType]);
      }

      // Clear the document
      setDocuments((prev) => ({
        ...prev,
        [docType]: null,
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [docType]: null,
      }));

      toast.success("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check required documents
      const requiredDocs = ["birthCertificate", "childPhoto", "parentAadhar"];
      const missingDocs = requiredDocs.filter((doc) => !documents[doc]?.url);

      if (missingDocs.length > 0) {
        toast.error(`Missing required documents: ${missingDocs.join(", ")}`);
        return;
      }


      const documentsData = {
        birthCertificate:
          documents.birthCertificate?.url || documents.birthCertificate,
        childPhoto: documents.childPhoto?.url || documents.childPhoto,
        childAadhar: documents.childAadhar?.url || documents.childAadhar,
        parentAadhar: documents.parentAadhar?.url || documents.parentAadhar,
        addressProof: documents.addressProof?.url || documents.addressProof,
      };

      // Prepare submission data
      const submissionData = {
        ...formData,
        documents: documentsData,
      };

      // Submit the form
      const response = await axiosInstance.post(
        "/student/register",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Application submitted successfully!");

      // Reset form after successful submission
      setFormData({
        childName: "",
        dateOfBirth: "",
        gender: "",
        grade: "",
        parentName: "",
        email: "",
        phone: "",
        address: "",
        emergencyContact: "",
        previousSchool: "",
        medicalInfo: "",
        fatherName: "",
        motherName: "",
        fatherOccupation: "",
        motherOccupation: "",
        annualIncome: "",
        religion: "",
        category: "",
        bloodGroup: "",
        height: "",
        weight: "",
        guardianRelation: "",
        alternatePhone: "",
      });

      // Clear documents
      Object.keys(documents).forEach((docType) => {
        if (previewUrls[docType]) {
          URL.revokeObjectURL(previewUrls[docType]);
        }
      });

      setDocuments({
        birthCertificate: null,
        childPhoto: null,
        childAadhar: null,
        parentAadhar: null,
        addressProof: null,
      });

      setPreviewUrls({
        birthCertificate: null,
        childPhoto: null,
        childAadhar: null,
        parentAadhar: null,
        addressProof: null,
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return FileText;

    // Handle both original File object and Cloudinary response
    const fileType =
      file.type ||
      (file.format === "pdf" ? "application/pdf" : `image/${file.format}`);

    if (fileType.startsWith("image/")) return Eye;
    if (fileType === "application/pdf") return FileText;
    return FileText;
  };

  const isImageFile = (file) => {
    if (!file) return false;

    // Handle both original File object and Cloudinary response
    if (file.type) {
      return file.type.startsWith("image/");
    }
    if (file.format) {
      return ["jpg", "jpeg", "png", "gif"].includes(file.format.toLowerCase());
    }
    return false;
  };

  const isPdfFile = (file) => {
    if (!file) return false;

    // Handle both original File object and Cloudinary response
    if (file.type) {
      return file.type === "application/pdf";
    }
    if (file.format) {
      return file.format.toLowerCase() === "pdf";
    }
    return false;
  };

  const DocumentUpload = ({
    docType,
    title,
    required = true,
    accept = ".pdf,.jpg,.jpeg,.png",
  }) => {
    const file = documents[docType];
    const previewUrl = previewUrls[docType];
    const FileIcon = getFileIcon(file);

    // Get display name for the file
    const getFileName = () => {
      if (!file) return "";
      if (file.name) return file.name; // Original file
      if (file.file?.name) return file.file.name; // Cloudinary response with original file
      return `Uploaded ${docType.replace(/([A-Z])/g, " $1")}`; // Fallback
    };

    // Get display size for the file
    const getFileSize = () => {
      if (!file) return "0 MB";
      if (file.size) return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      if (file.bytes) return `${(file.bytes / 1024 / 1024).toFixed(2)} MB`;
      return "Unknown size";
    };

    return (
      <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
        {file ? (
          <div className="space-y-3">
            {/* File Info Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">{title}</h4>
              <button
                onClick={() => handleFileRemove(docType)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Section */}
            <div className="text-center">
              {isImageFile(file) ? (
                <div className="relative">
                  <img
                    src={previewUrl || file.url} // Use Cloudinary URL if preview not available
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : isPdfFile(file) ? (
                <div className="w-32 h-32 bg-red-50 rounded-lg mx-auto border-2 border-red-200 flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-red-500 mb-2" />
                  <span className="text-xs text-red-600 font-medium">PDF</span>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-50 rounded-lg mx-auto border-2 border-gray-200 flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">
                    FILE
                  </span>
                </div>
              )}
            </div>

            {/* File Details */}
            <div className="text-center">
              <p className="text-green-600 text-sm font-medium mb-1">
                ✓ {getFileName()}
              </p>
              <p className="text-gray-500 text-xs">{getFileSize()}</p>

              {/* Change File Button */}
              <div className="mt-2">
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileUpload(docType, e.target.files[0])}
                  className="hidden"
                  id={`${docType}-change`}
                />
                <label
                  htmlFor={`${docType}-change`}
                  className="inline-block bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-md cursor-pointer transition-colors text-xs font-medium"
                >
                  Change File
                </label>
              </div>
            </div>
          </div>
        ) : (
          // Upload State (unchanged)
          <div className="text-center">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-700 mb-1">{title}</h4>
            {required && (
              <span className="text-red-500 text-sm">*Required</span>
            )}
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileUpload(docType, e.target.files[0])}
              className="hidden"
              id={docType}
            />
            <label
              htmlFor={docType}
              className="mt-2 inline-block bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {accept.includes("image")
                ? "Images & PDFs accepted"
                : "PDF files accepted"}
            </p>
          </div>
        )}
      </div>
    );
  };
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 6);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 mt-14">
        <div className="max-w-6xl mx-auto">
          {/* Child Information Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 rounded-full p-3 mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Child Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  placeholder="Enter child's full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Boy</option>
                  <option value="female">Girl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Applying For <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="nursery">Nursery (2-3 years)</option>
                  <option value="pre-kg">Pre-KG (3-4 years)</option>
                  <option value="kg">KG (4-5 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Religion
                </label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  placeholder="Religion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Height in cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Weight in kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Previous School/Daycare (if any)
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  placeholder="Name of previous school or daycare"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Information / Special Needs / Allergies
                </label>
                <textarea
                  name="medicalInfo"
                  rows={3}
                  value={formData.medicalInfo}
                  onChange={handleInputChange}
                  placeholder="Any allergies, medical conditions, or special needs we should know about..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Parent/Guardian Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Father's full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Mother's full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Guardian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Primary guardian name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guardian Relation to Child
                </label>
                <select
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Relation</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="grandfather">Grandfather</option>
                  <option value="grandmother">Grandmother</option>
                  <option value="uncle">Uncle</option>
                  <option value="aunt">Aunt</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father's Occupation
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  placeholder="Father's occupation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother's Occupation
                </label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  placeholder="Mother's occupation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Family Income
                </label>
                <select
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Income Range</option>
                  <option value="below-2lakh">Below ₹2 Lakhs</option>
                  <option value="2-5lakh">₹2-5 Lakhs</option>
                  <option value="5-10lakh">₹5-10 Lakhs</option>
                  <option value="10-20lakh">₹10-20 Lakhs</option>
                  <option value="above-20lakh">Above ₹20 Lakhs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternate Phone Number
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House number, street, locality, city, state, pincode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-500 rounded-full p-3 mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Required Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentUpload
                docType="birthCertificate"
                title="Birth Certificate"
                required={true}
              />

              <DocumentUpload
                docType="childPhoto"
                title="Passport Size Photo of Child"
                required={true}
                accept=".jpg,.jpeg,.png"
              />

              <DocumentUpload
                docType="childAadhar"
                title="Child's Aadhar Card"
                required={false}
              />

              <DocumentUpload
                docType="parentAadhar"
                title="Parent's Aadhar Card"
                required={true}
              />

              <DocumentUpload
                docType="addressProof"
                title="Address Proof"
                required={true}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">
                Acceptable Address Proof Documents:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Electricity Bill (not older than 3 months)</li>
                  <li>• Rent Agreement</li>
                  <li>• Voter ID Card</li>
                </ul>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Property Tax Receipt</li>
                  <li>• Bank Statement</li>
                  <li>• Ration Card</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-t-4 border-orange-500">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Submit Application?
              </h3>
              <p className="text-gray-600 mb-6">
                Please review all information carefully before submitting. Our
                admission team will contact you within 2-3 working days after
                reviewing your application.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <input type="checkbox" id="terms" className="rounded" />
                  <label htmlFor="terms">
                    I declare that all information provided is true and correct
                    to the best of my knowledge.
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-12 py-4 rounded-full text-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600">+91 98765 43210</p>
            <p className="text-gray-600">+91 87654 32109</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600">admissions@littlestars.edu</p>
            <p className="text-gray-600">info@littlestars.edu</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600">123 Education Street</p>
            <p className="text-gray-600">Learning City - 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
