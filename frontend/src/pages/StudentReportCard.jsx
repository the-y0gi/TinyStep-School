import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Target,
  Star,
  Printer,
  Download,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Award,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

export default function StudentReportCard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getStudentId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.children?.[0]?._id || null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  const studentId = getStudentId();

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!studentId) throw new Error("No student ID found");

      // Fetch all data in parallel
      const [studentRes, attendanceRes, resultsRes] = await Promise.all([
        axiosInstance.get(`/dashboard/students/${studentId}/report-card`),
        axiosInstance.get(`/dashboard/attendance/report/${studentId}`),
        axiosInstance.get(`/dashboard/results/report/${studentId}`),
      ]);

      const studentData = studentRes.data;
      const attendanceData = attendanceRes.data;
      const resultsData = resultsRes.data;

      // Format the data for UI
      const formattedData = {
        studentInfo: {
          id: studentData.studentInfo?.id || "N/A",
          name: studentData.studentInfo?.name || "N/A",
          dob: studentData.studentInfo?.dob
            ? new Date(studentData.studentInfo.dob).toLocaleDateString()
            : "N/A",
          gender: studentData.studentInfo?.gender || "N/A",
          profileImage: studentData.studentInfo?.profileImage || null,
          medicalInfo: {
            bloodGroup:
              studentData.studentInfo?.medicalInfo?.bloodGroup || "N/A",
            allergies: studentData.studentInfo?.medicalInfo?.allergies || "N/A",
            specialNeeds:
              studentData.studentInfo?.medicalInfo?.specialNeeds || "N/A",
            height: studentData.studentInfo?.medicalInfo?.height || "N/A",
            weight: studentData.studentInfo?.medicalInfo?.weight || "N/A",
          },
        },
        classInfo: {
          name: studentData.classInfo?.name || "N/A",
          section: studentData.classInfo?.section || "N/A",
          academicYear: studentData.classInfo?.academicYear || "N/A",
          teacher: studentData.classInfo?.teacher || "N/A",
          feeStructure: studentData.classInfo?.feeStructure || {
            annualFee: "N/A",
            tuitionFee: "N/A",
            admissionFee: "N/A",
            otherCharges: "N/A",
          },
        },
        parentInfo: {
          fatherName: studentData.parentInfo?.fatherName || "N/A",
          motherName: studentData.parentInfo?.motherName || "N/A",
          guardianName: studentData.parentInfo?.guardianName || "N/A",
          relation: studentData.parentInfo?.relation || "N/A",
          contact: studentData.parentInfo?.contact || "N/A",
          alternateContact: studentData.parentInfo?.alternateContact || "N/A",
          emergencyContact: studentData.parentInfo?.emergencyContact || "N/A",
          email: studentData.parentInfo?.email || "N/A",
          address: studentData.parentInfo?.address || "N/A",
          fatherOccupation: studentData.parentInfo?.fatherOccupation || "N/A",
          motherOccupation: studentData.parentInfo?.motherOccupation || "N/A",
        },
        academicInfo: {
          attendance: {
            present: attendanceData?.presentDays || 0,
            total: attendanceData?.totalSchoolDays || 0,
            percentage: attendanceData?.attendancePercentage || 0,
          },
          result: {
            examType: resultsData?.examType || "N/A",
            examDate: resultsData?.examDate
              ? new Date(resultsData.examDate).toLocaleDateString()
              : "N/A",
            subjects:
              resultsData?.subjects?.map((subject) => ({
                name: subject.name || "N/A",
                marksObtained: subject.marksObtained || 0,
                maxMarks: subject.maxMarks || 100,
                percentage: subject.percentage || 0,
                grade: subject.grade || "N/A",
              })) || [],
            percentage: resultsData?.overall?.percentage || 0,
            overallGrade: resultsData?.overall?.grade || "N/A",
            rank: resultsData?.overall?.rank || "N/A",
            isPublished: resultsData?.isPublished || false,
          },
        },
        generatedDate: new Date().toLocaleDateString(),
      };

      setStudentData(formattedData);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load data"
      );
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => navigate("/student-dashboard");

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "text-green-600 bg-green-100";
      case "A":
        return "text-blue-600 bg-blue-100";
      case "B+":
        return "text-yellow-600 bg-yellow-100";
      case "B":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderStars = (count) => {
    if (!count) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  useEffect(() => {
    if (studentId) fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading report card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Report Card
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchStudentData}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 mt-18">
      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between print:hidden">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
        {/* <div className="flex gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            PDF
          </button>
        </div> */}
      </div>

      {/* Report Card Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Header Section with Profile */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-4 sm:px-6 py-6 sm:py-8 text-center relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-200 rounded-full mx-auto mb-4 overflow-hidden border-3 sm:border-4 border-white shadow-lg">
            {studentData.studentInfo.profileImage ? (
              <img
                src={studentData.studentInfo.profileImage}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-300 flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Student Report Card
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Academic Session {studentData.classInfo.academicYear}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student Name Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm opacity-90 font-medium">
                    Student Name
                  </p>
                  <p className="font-bold text-sm sm:text-lg truncate">
                    {studentData.studentInfo.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Rank Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm opacity-90 font-medium">
                    Class Rank
                  </p>
                  <p className="font-bold text-sm sm:text-lg">
                    #{studentData.academicInfo.result.rank}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Percentile Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm opacity-90 font-medium">
                    Average Percentile
                  </p>
                  <p className="font-bold text-sm sm:text-lg">
                    {studentData.academicInfo.result.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information Grid */}
        <div className="px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Student's name:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.studentInfo.name}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Class & section:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.classInfo.name}-{studentData.classInfo.section}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Year:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.classInfo.academicYear}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Student ID:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {/* {studentData.studentInfo.id} <p className="font-medium text-gray-900"> */}
                    {`STU-${studentData.studentInfo.id?.substring(0, 8).toUpperCase()}`} <p className="font-medium text-gray-900"></p>
                  {/* </p> */}

                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Academic Details
              </h3>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Teacher's Name:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.classInfo.teacher}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Batch:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.classInfo.academicYear}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Attendance:
                </span>
                <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                  {studentData.academicInfo.attendance.percentage}%
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Overall Grade:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mt-1 sm:mt-0 self-start sm:self-center ${getGradeColor(
                    studentData.academicInfo.result.overallGrade
                  )}`}
                >
                  {studentData.academicInfo.result.overallGrade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Performance Summary
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {studentData.academicInfo.attendance.present}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Days Present
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {studentData.academicInfo.attendance.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total School Days
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-orange-500 mb-1">
                  {studentData.academicInfo.attendance.percentage}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Attendance Percentage
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1">
                  #{studentData.academicInfo.result.rank}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Class Rank
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="px-4 sm:px-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            Subject-wise Performance
          </h3>

          {/* Mobile View - Card Layout */}
          <div className="block lg:hidden space-y-4">
            {studentData.academicInfo.result.subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {subject.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Max: {subject.maxMarks} marks
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                      subject.grade
                    )}`}
                  >
                    {subject.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Marks</p>
                    <p className="font-semibold text-sm">
                      {subject.marksObtained}/{subject.maxMarks}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Percentage</p>
                    <p className="font-semibold text-sm">
                      {subject.percentage}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Performance</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <div className="col-span-5">Subject Name</div>
                <div className="col-span-2 text-center">Marks</div>
                <div className="col-span-2 text-center">Percentage</div>
                <div className="col-span-2 text-center">Grade</div>
                <div className="col-span-1 text-center">Performance</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {studentData.academicInfo.result.subjects.map(
                (subject, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 bg-white hover:bg-orange-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <p className="font-medium text-gray-800">
                          {subject.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Max: {subject.maxMarks} marks
                        </p>
                      </div>

                      <div className="col-span-2 text-center">
                        <p className="font-semibold text-gray-800">
                          {subject.marksObtained}/{subject.maxMarks}
                        </p>
                      </div>

                      <div className="col-span-2 text-center">
                        <p className="font-semibold text-gray-800">
                          {subject.percentage}%
                        </p>
                      </div>

                      <div className="col-span-2 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                            subject.grade
                          )}`}
                        >
                          {subject.grade}
                        </span>
                      </div>

                      <div className="col-span-1 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${subject.percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-600 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Generated on: {studentData.generatedDate}</span>
              </div>
              <div>
                Student ID:{" "}
                {`STU-${studentData.studentInfo.id
                  ?.substring(0, 8)
                  .toUpperCase()}`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                Academic Session: {studentData.classInfo.academicYear}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
