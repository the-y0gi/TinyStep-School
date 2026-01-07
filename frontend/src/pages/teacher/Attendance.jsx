import React, { useState, useEffect } from "react";
import {
  Upload,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Save,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "../../services/axiosConfig";
import { toast } from "react-toastify";

export default function AttendancePage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [schoolDays, setSchoolDays] = useState("");
  const [students, setStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [savedAttendanceByClass, setSavedAttendanceByClass] = useState({});
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [expandedClasses, setExpandedClasses] = useState({});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get current month and year
  const getCurrentMonth = () => {
    const now = new Date();
    return {
      month: months[now.getMonth()],
      monthNumber: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  // Toggle expanded view for a class
  const toggleClassExpansion = (classKey) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [classKey]: !prev[classKey],
    }));
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/teacher/classes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setClasses(response.data.classes);
      if (response.data.classes.length > 0) {
        setSelectedClass(response.data.classes[0]._id);
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const current = getCurrentMonth();
      const response = await axiosInstance.get(
        `/teacher/students-for-attendance`,
        {
          params: {
            classId: selectedClass,
            month: current.monthNumber,
            year: current.year,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.students.length === 0) {
        toast.info("This class has no students assigned yet");
      }

      setStudentList(response.data.students);

      // Initialize attendance data with existing values if available
      const initialAttendance = {};
      response.data.students.forEach((student) => {
        if (student.existingAttendance) {
          initialAttendance[student._id] = student.existingAttendance.presentDays;
        }
      });
      setAttendanceData(initialAttendance);

      if (response.data.schoolDays) {
        setSchoolDays(response.data.schoolDays);
      }

      // If there are students with existing attendance, add to savedAttendance
      if (response.data.students.some(s => s.existingAttendance)) {
        const classKey = `${selectedClass}-${current.monthNumber}-${current.year}`;
        const classInfo = classes.find((cls) => cls._id === selectedClass);

        setSavedAttendanceByClass((prev) => {
          const newData = {
            ...prev,
            [classKey]: {
              classInfo,
              month: current.month,
              year: current.year,
              schoolDays: response.data.schoolDays,
              students: response.data.students.map((student) => ({
                ...student,
                presentDays: student.existingAttendance?.presentDays || 0,
              })),
              savedDate: new Date().toLocaleDateString(),
            },
          };

          // Save to localStorage
          localStorage.setItem('savedAttendanceByClass', JSON.stringify(newData));
          return newData;
        });
      }
    } catch (error) {
      toast.error("Failed to fetch students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const current = getCurrentMonth();
    setSelectedMonth(current.month);
    
    // Load saved attendance from localStorage if available
    const savedData = localStorage.getItem('savedAttendanceByClass');
    if (savedData) {
      setSavedAttendanceByClass(JSON.parse(savedData));
    }
    
    fetchClasses();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const handleThisMonthAttendance = () => {
    setCurrentView("attendance");
  };

  const handleAttendanceChange = (studentId, presentDays) => {
    const days = parseInt(presentDays) || 0;
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: days > parseInt(schoolDays) ? parseInt(schoolDays) : days,
    }));
  };

  const saveAttendance = async () => {
    if (!schoolDays) {
      toast.error("Please enter total school days");
      return;
    }

    try {
      setLoading(true);
      const current = getCurrentMonth();

      const attendanceRecords = studentList.map((student) => ({
        studentId: student._id,
        presentDays: attendanceData[student._id] || 0,
        totalSchoolDays: parseInt(schoolDays),
      }));

      await axiosInstance.post(
        "/teacher/submit-attendance",
        {
          month: current.monthNumber,
          year: current.year,
          classId: selectedClass,
          attendanceRecords,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the savedAttendanceByClass state
      const classKey = `${selectedClass}-${current.monthNumber}-${current.year}`;
      const classInfo = classes.find((cls) => cls._id === selectedClass);

      setSavedAttendanceByClass((prev) => {
        const newData = {
          ...prev,
          [classKey]: {
            classInfo,
            month: current.month,
            year: current.year,
            schoolDays: parseInt(schoolDays),
            students: studentList.map((student) => ({
              ...student,
              presentDays: attendanceData[student._id] || 0,
            })),
            savedDate: new Date().toLocaleDateString(),
          },
        };

        // Save to localStorage
        localStorage.setItem('savedAttendanceByClass', JSON.stringify(newData));
        return newData;
      });

      toast.success("Attendance saved successfully!");
      setCurrentView("dashboard");
    } catch (error) {
      toast.error("Failed to save attendance");
      console.error("Error saving attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const getAttendancePercentage = (presentDays, totalDays) => {
    if (!totalDays || totalDays === 0) return 0;
    return ((presentDays / parseInt(totalDays)) * 100).toFixed(1);
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90)
      return {
        status: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (percentage >= 75)
      return { status: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return {
        status: "Average",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { status: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  // Dashboard View
  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Attendance Management
              </h1>
              <p className="text-gray-600 mb-8">
                Manage and track student attendance efficiently
              </p>
              <div className="flex flex-col items-center gap-4">
                {classes && classes.length > 0 ? (
                  <>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name} - {cls.section} (
                          {cls.students?.length || 0} students)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleThisMonthAttendance}
                      disabled={loading || !selectedClass}
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg disabled:bg-blue-400"
                    >
                      {loading ? "Loading..." : "This Month Attendance"}
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">
                      No classes assigned to you
                    </p>
                    <button
                      disabled={true}
                      className="bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg cursor-not-allowed"
                    >
                      This Month Attendance
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Show saved attendance for all classes */}
          {Object.values(savedAttendanceByClass).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Saved Attendance Records
              </h2>

              {Object.entries(savedAttendanceByClass).map(
                ([classKey, attendance]) => {
                  const isExpanded = expandedClasses[classKey];
                  return (
                    <div
                      key={classKey}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {attendance.classInfo.name} -{" "}
                                {attendance.classInfo.section}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {attendance.month} {attendance.year} • Saved on{" "}
                                {attendance.savedDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                {attendance.students.length}
                              </p>
                              <p className="text-sm text-gray-500">Students</p>
                            </div>
                            <button
                              onClick={() => toggleClassExpansion(classKey)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Quick Stats for this class */}
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-blue-900">
                              {attendance.students.length}
                            </p>
                            <p className="text-xs text-blue-700">
                              Total Students
                            </p>
                          </div>

                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-green-900">
                              {
                                attendance.students.filter(
                                  (s) =>
                                    getAttendancePercentage(
                                      s.presentDays,
                                      attendance.schoolDays
                                    ) >= 75
                                ).length
                              }
                            </p>
                            <p className="text-xs text-green-700">
                              Good Attendance
                            </p>
                          </div>

                          <div className="bg-red-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-red-900">
                              {
                                attendance.students.filter(
                                  (s) =>
                                    getAttendancePercentage(
                                      s.presentDays,
                                      attendance.schoolDays
                                    ) < 60
                                ).length
                              }
                            </p>
                            <p className="text-xs text-red-700">
                              Poor Attendance
                            </p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-purple-900">
                              {attendance.schoolDays}
                            </p>
                            <p className="text-xs text-purple-700">
                              School Days
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Student List */}
                      {isExpanded && (
                        <div className="border-t border-gray-200">
                          <div className="p-6">
                            <h3 className="font-medium text-gray-700 mb-3">
                              Complete Attendance List
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Student
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Present Days
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Percentage
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {attendance.students.map((student) => {
                                    const percentage = getAttendancePercentage(
                                      student.presentDays,
                                      attendance.schoolDays
                                    );
                                    const status =
                                      getAttendanceStatus(percentage);
                                    return (
                                      <tr key={student._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                              <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">
                                                {student.name}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {student.presentDays} /{" "}
                                          {attendance.schoolDays}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                            {percentage}%
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span
                                            className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.color}`}
                                          >
                                            {status.status}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Attendance Input View
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={goBackToDashboard}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Upload className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedMonth} Attendance
            </h1>
          </div>

          {/* Class and School Days Input */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total School Days in {selectedMonth}
              </label>
              <input
                type="number"
                value={schoolDays}
                onChange={(e) => setSchoolDays(e.target.value)}
                placeholder="e.g., 22"
                min="1"
                max="31"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Attendance Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Attendance
            </h2>
            <span className="text-sm text-gray-500">
              {studentList.length} Students
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {studentList.map((student) => (
                  <div
                    key={student._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {student.name}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Present Days
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={schoolDays || 31}
                        value={attendanceData[student._id] || ""}
                        onChange={(e) =>
                          handleAttendanceChange(student._id, e.target.value)
                        }
                        placeholder="0"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={saveAttendance}
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-green-400"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Attendance
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}