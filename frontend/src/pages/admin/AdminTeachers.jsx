import { teacherAPI } from "../../services/adminAllAPI's";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  Users,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import axiosInstance from "../../services/axiosConfig";

const AdminTeachers = () => {
  // State for add teacher form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualifications: "",
    phone: "",
    password: "",
  });

  // State for teacher list
  const [teachers, setTeachers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'add'

  // State for class assignment
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAllTeachers();
      setTeachers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert(
        "Failed to fetch teachers: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes for assignment
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/admin/classes");
      setClasses(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  // Handle teacher creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await teacherAPI.createTeacher(formData);
      alert("Teacher created successfully!");
      setFormData({
        name: "",
        email: "",
        qualifications: "",
        phone: "",
        password: "",
      });
      setShowPassword(false);
      fetchTeachers(); // Refresh the list
      setActiveTab("list"); // Switch to list view
    } catch (error) {
      alert(
        "Error creating teacher: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle class assignment
  const handleAssignClass = async () => {
    try {
      setLoading(true);
      await teacherAPI.assignClassToTeacher(selectedTeacher, selectedClass);
      alert("Class assigned successfully!");
      fetchTeachers(); // Refresh the list
      setShowAssignModal(false);
      setSelectedClass("");
    } catch (error) {
      alert("Failed to assign class: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 px-4 sm:px-6 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              <span>Teacher Management</span>
            </h1>
            <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage teachers and assign classes efficiently
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b bg-gray-50">
            <button
              className={`flex-1 sm:flex-none sm:px-8 py-3 sm:py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 sm:border-b-3 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Teacher List</span>
              <span className="sm:hidden">List</span>
            </button>
            <button
              className={`flex-1 sm:flex-none sm:px-8 py-3 sm:py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                activeTab === "add"
                  ? "text-blue-600 border-b-2 sm:border-b-3 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("add")}
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Teacher</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {activeTab === "add" ? (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Add New Teacher
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter teacher's full name"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="teacher@school.com"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., M.Ed, B.Sc in Mathematics"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    value={formData.qualifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        qualifications: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 pr-12"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Teacher...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Teacher
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    All Teachers
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage and assign classes to teachers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading teachers...</p>
                  </div>
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No teachers found
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Get started by adding your first teacher
                  </p>
                  <button
                    onClick={() => setActiveTab("add")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Add Teacher
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-4 font-semibold text-gray-700 rounded-tl-lg">
                            Name
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Qualifications
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Phone
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Assigned Classes
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 rounded-tr-lg">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((teacher, index) => (
                          <tr
                            key={teacher._id}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {teacher.personalInfo?.name?.charAt(0) || "T"}
                                </div>
                                <span className="font-medium text-gray-800">
                                  {teacher.personalInfo?.name || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600">
                              {teacher.email || "N/A"}
                            </td>
                            <td className="p-4 text-gray-600">
                              {teacher.qualifications || "N/A"}
                            </td>
                            <td className="p-4 text-gray-600">
                              {teacher.phone || "N/A"}
                            </td>
                            <td className="p-4">
                              {teacher.teacherDetails?.assignedClasses?.length >
                              0 ? (
                                <div className="space-y-1">
                                  {teacher.teacherDetails.assignedClasses.map(
                                    (cls, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-1 mb-1"
                                      >
                                        {cls.classId?.name} (
                                        {cls.classId?.section})
                                      </span>
                                    )
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  No classes assigned
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => {
                                  setSelectedTeacher(teacher._id);
                                  setShowAssignModal(true);
                                }}
                                disabled={loading}
                              >
                                Assign Class
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet View */}
                  <div className="lg:hidden space-y-4">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {teacher.personalInfo?.name?.charAt(0) || "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2 break-words">
                              {teacher.personalInfo?.name || "N/A"}
                            </h3>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2 text-gray-600">
                                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="break-all">
                                  {teacher.email || "N/A"}
                                </span>
                              </div>

                              {teacher.qualifications && (
                                <div className="flex items-start gap-2 text-gray-600">
                                  <GraduationCap className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span className="break-words">
                                    {teacher.qualifications}
                                  </span>
                                </div>
                              )}

                              {teacher.phone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Phone className="h-4 w-4 flex-shrink-0" />
                                  <span>{teacher.phone}</span>
                                </div>
                              )}

                              <div className="flex items-start gap-2 text-gray-600">
                                <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  {teacher.teacherDetails?.assignedClasses
                                    ?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {teacher.teacherDetails.assignedClasses.map(
                                        (cls, idx) => (
                                          <span
                                            key={idx}
                                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                                          >
                                            {cls.classId?.name} (
                                            {cls.classId?.section})
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 italic">
                                      No classes assigned
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => {
                                setSelectedTeacher(teacher._id);
                                setShowAssignModal(true);
                              }}
                              disabled={loading}
                            >
                              Assign Class
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Assign Class Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Assign Class
                </h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Select a class to assign to this teacher
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-2 mb-6">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Class
                  </label>
                  <select
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Choose a class...</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} - Section {cls.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedClass("");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignClass}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    disabled={!selectedClass || loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Assign Class
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeachers;
