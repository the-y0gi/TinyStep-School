import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Baby,
  User,
  Calendar,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import axiosInstance from "../services/axiosConfig";

const KidsAttendanceTracker = () => {
  const [kidData, setKidData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get student ID from localStorage (assuming parent is logged in)
  const getStudentId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.children && user.children.length > 0) {
        return user.children[0]; // Assuming first child
      }
      return null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  // Fetch all data for the dashboard
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const student = getStudentId();
      if (!student) {
        throw new Error("No student found");
      }

      const [kidRes, attendanceRes, notificationsRes] = await Promise.all([
        axiosInstance.get(`/dashboard/students/tracking/${student._id}`),
        axiosInstance.get(`/dashboard/attendance/${student._id}`),
        axiosInstance.get(`/dashboard/notifications/student/${student._id}?limit=5`)
      ]);

      setKidData(kidRes.data);
      setAttendanceData(attendanceRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#3B82F6" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!kidData || !attendanceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Baby className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Student Data Found</h3>
          <p className="text-gray-600">Please check if your account has any associated students</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 p-4 lg:p-6 mt-18">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-t-4 border-pink-400">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                {kidData.profileImage ? (
                  <img
                    src={kidData.profileImage}
                    alt={kidData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Baby className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Hi {kidData.nickname || kidData.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  {kidData.class} • {kidData.section} Section
                </p>
                <p className="text-sm text-gray-500">
                  Age: {kidData.age} years • Teacher: {kidData.teacherName}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-2xl border-2 border-green-200">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-sm font-semibold text-gray-800">
                  Learning Progress
                </p>
                <p className="text-xs text-gray-600">
                  {attendanceData.currentMonth.percentage >= 90 
                    ? "Excellent!" 
                    : attendanceData.currentMonth.percentage >= 75 
                    ? "Good!" 
                    : "Needs Improvement"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Attendance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Monthly Attendance</h2>
                </div>
                <button 
                  onClick={fetchData}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  title="Refresh data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Attendance Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                
                {/* Current Month */}
                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {attendanceData.currentMonth.month} {attendanceData.currentMonth.year}
                    </h3>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <CircularProgress 
                      percentage={attendanceData.currentMonth.percentage}
                      color="#8B5CF6"
                      size={140}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                      <div className="text-xl font-bold text-green-600">
                        {attendanceData.currentMonth.presentDays}
                      </div>
                      <p className="text-xs text-gray-600">Present Days</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                      <div className="text-xl font-bold text-red-600">
                        {attendanceData.currentMonth.absentDays}
                      </div>
                      <p className="text-xs text-gray-600">Absent Days</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-700">
                      Total School Days: <span className="font-semibold">{attendanceData.currentMonth.totalDays}</span>
                    </p>
                  </div>
                </div>

                {/* Previous Month */}
                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {attendanceData.previousMonth.month} {attendanceData.previousMonth.year}
                    </h3>
                    <p className="text-sm text-gray-600">Previous Month</p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <CircularProgress 
                      percentage={attendanceData.previousMonth.percentage}
                      color="#F59E0B"
                      size={140}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                      <div className="text-xl font-bold text-green-600">
                        {attendanceData.previousMonth.presentDays}
                      </div>
                      <p className="text-xs text-gray-600">Present Days</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                      <div className="text-xl font-bold text-red-600">
                        {attendanceData.previousMonth.absentDays}
                      </div>
                      <p className="text-xs text-gray-600">Absent Days</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-700">
                      Total School Days: <span className="font-semibold">{attendanceData.previousMonth.totalDays}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center gap-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <div className="text-center">
                    {attendanceData.currentMonth.percentage >= attendanceData.previousMonth.percentage ? (
                      <p className="text-sm text-green-600 font-semibold">
                        🎉 Great job! Improved attendance this month!
                      </p>
                    ) : (
                      <p className="text-sm text-orange-600 font-semibold">
                        📈 Let's work on improving attendance next month!
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {attendanceData.currentMonth.percentage > attendanceData.previousMonth.percentage 
                        ? `+${(attendanceData.currentMonth.percentage - attendanceData.previousMonth.percentage).toFixed(1)}% improvement`
                        : attendanceData.currentMonth.percentage < attendanceData.previousMonth.percentage
                        ? `${(attendanceData.previousMonth.percentage - attendanceData.currentMonth.percentage).toFixed(1)}% decrease`
                        : 'Same as last month'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-[540px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Daily Updates</h2>
                </div>
                <button 
                  onClick={fetchData}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  title="Refresh notifications"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border-2 ${notification.color} transition-all hover:shadow-md cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{notification.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800 mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No notifications yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsAttendanceTracker;