import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  CheckCircle,
  CreditCard,
  Star,
  Phone,
  Mail,
  MapPin,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { getStudentProfile } from "../services/adminAllAPI's";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get student ID from URL

  const navigate = useNavigate();

  // Get student ID from localStorage
  const getStudentId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.children && user.children.length > 0) {
        return user.children[0]._id; // Assuming you want the first child
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };
  const studentId = getStudentId();
  if (!studentId) {
    throw new Error("No student ID found");
  }
  // Fetch student data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getStudentProfile(studentId); // API call
        setStudentData(data);
      } catch (err) {
        setError(err.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // API integration functions
  const handleViewFees = () => {
    navigate("/fee-management");
  };

  const handleViewResults = () => {
    navigate("/student-result");
  };

  const handleTrackStudent = () => {
    navigate("/track-card");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {studentData?.profileImage ? (
                    <img
                      src={studentData.profileImage}
                      alt={studentData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {studentData?.name}
                </h2>
                <div className="h-px bg-gray-200 w-full my-3"></div>
              </div>

              {/* Display real data from backend */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Class:</span>
                    <p className="font-medium text-gray-900">
                      {studentData?.class || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Batch:</span>
                    <p className="font-medium text-gray-900">
                      {studentData?.batch || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">Student ID:</span>
                  <p className="font-medium text-gray-900">
                    {`STU-${studentData?.id?.substring(0, 8).toUpperCase()}`}
                  </p>
                </div>

                <div className="h-px bg-gray-200 w-full my-4"></div>

                {/* Parent Info */}
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Father's name:</span>
                    <p className="font-medium text-gray-900">
                      {studentData?.fatherName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mother's name:</span>
                    <p className="font-medium text-gray-900">
                      {studentData?.motherName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-200 w-full my-4"></div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900">
                      {studentData?.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900 break-all">
                      {studentData?.email || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="font-medium text-gray-900">
                      {studentData?.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Cards - With Registration and Payment Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {studentData?.currentSession}
                </p>
                <p className="text-xs text-gray-600">Current Session</p>
              </div>

              {/* Registration Status (Static) */}
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Registration Status
                </p>
                <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center bg-green-500">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Payment Status (Static) */}
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center bg-green-500">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {studentData?.class}
                </p>
                <p className="text-xs text-gray-600">Current Class</p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Structure Card */}
              <div
                className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden cursor-pointer hover:from-slate-500 hover:to-slate-600 transition-all"
                onClick={handleViewFees}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fee Structure</h3>
                  <p className="text-white/90 mb-6">and Payments</p>
                  <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              </div>

              {/* Track Your Kid Card */}
              <div
                className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-8 text-white relative overflow-hidden cursor-pointer hover:from-gray-500 hover:to-gray-600 transition-all"
                onClick={handleTrackStudent}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track your kid</h3>
                  <p className="text-white/90 mb-4">
                    Location, attendance & activities
                  </p>
                  <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Track Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              </div>
            </div>

            {/* Check Result Card */}
            <div
              className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-8 text-white relative overflow-hidden cursor-pointer hover:from-gray-500 hover:to-gray-600 transition-all"
              onClick={handleViewResults}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Check Result</h3>
                    <p className="text-white/90 mb-4">
                      Latest exam results available
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Results
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                      <Star className="w-12 h-12 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
