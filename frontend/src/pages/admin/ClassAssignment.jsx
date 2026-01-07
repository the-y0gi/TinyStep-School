import { useState, useEffect } from "react";
import {
  classAPI,
  teacherAPI,
  getAllStudents,
} from "../../services/adminAllAPI's";

const ClassManagement = () => {
  // State for Create Class
  const [formData, setFormData] = useState({
    name: "",
    section: "A",
    capacity: 20,
    teacherId: "",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });

  // State for Class List
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // State for Add Students Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for View Students Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [currentClassName, setCurrentClassName] = useState("");

  // Fetch classes and teachers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classRes = await classAPI.getAllClasses();
        setClasses(Array.isArray(classRes.data.data) ? classRes.data.data : []);

        // Fetch teachers
        const teacherRes = await teacherAPI.getAllTeachers();
        setTeachers(teacherRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle class creation
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      // Validate academic year format
      if (!/^\d{4}-\d{4}$/.test(formData.academicYear)) {
        alert("Academic year must be in format YYYY-YYYY (e.g., 2023-2024)");
        return;
      }

      // Validate capacity
      if (formData.capacity <= 0) {
        alert("Capacity must be a positive number");
        return;
      }

      // Validate teacher selection
      if (
        formData.teacherId &&
        !teachers.some((t) => t._id === formData.teacherId)
      ) {
        alert("Please select a valid teacher");
        return;
      }

      await classAPI.createClass(formData);
      alert("Class created successfully!");

      // Refresh class list
      const res = await classAPI.getAllClasses();
      setClasses(Array.isArray(res.data.data) ? res.data.data : []);

      // Reset form
      setFormData({
        name: "",
        section: "A",
        capacity: 20,
        teacherId: "",
        academicYear: `${new Date().getFullYear()}-${
          new Date().getFullYear() + 1
        }`,
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Open add students modal
  const openAddStudentsModal = async (classId) => {
    setCurrentClassId(classId);
    setSelectedStudents([]);
    setError(null);

    try {
      // Fetch unassigned students
      const res = await getAllStudents();
      const allStudents = Array.isArray(res.data.data) ? res.data.data : [];
      const unassigned = allStudents.filter(
        (s) => !s.classInfo?.current?.classId && s.status === "active"
      );
      setStudents(unassigned);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
    }
  };

  // Handle assigning students to class
  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      await classAPI.addStudentsToClass(currentClassId, selectedStudents);
      alert(`${selectedStudents.length} students added successfully!`);

      // Refresh class list
      const res = await classAPI.getAllClasses();
      setClasses(Array.isArray(res.data.data) ? res.data.data : []);

      // Close modal
      setModalOpen(false);
    } catch (err) {
      console.error("Error adding students:", err);
      setError(err.response?.data?.message || "Failed to add students");
    } finally {
      setLoading(false);
    }
  };

  // Open view students modal
  const openViewStudentsModal = async (classId, className) => {
    try {
      const res = await classAPI.getClassDetails(classId);
      const classData = res.data.data;
      
      // Safely handle students array
      const studentsArray = Array.isArray(classData.students) ? classData.students : [];
      
      // No need to fetch students again since backend already populates them
      const enrolledStudents = studentsArray.map(student => ({
        id: student._id,
        name: student.name,
        image: student.image || '/default-student.png'
      }));

      setClassStudents(enrolledStudents);
      setCurrentClassName(`${className} - Section ${classData.section}`);
      setViewModalOpen(true);

    } catch (err) {
      console.error("Failed to fetch class details:", err);
      alert("Failed to load student list. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl sm:text-2xl">🏫</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Class Management
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">Manage classes, teachers, and student assignments</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Create Class Form */}
        <div className="xl:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">➕</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Create New Class</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2 text-sm font-medium">Class Name</label>
                <select
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Class Name --</option>
                  {["Nursery", "Pre-KG", "KG"].map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm font-medium">Section</label>
                <select
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                >
                  {["A", "B", "C", "D"].map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm font-medium">Class Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm font-medium">Assign Teacher</label>
                <select
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.personalInfo?.name || "Unnamed"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm font-medium">Academic Year</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, academicYear: e.target.value })
                  }
                  required
                  placeholder="e.g. 2023-2024"
                />
              </div>

              <button
                type="submit"
                onClick={handleCreateClass}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm sm:text-base transform hover:scale-[1.02] hover:shadow-lg"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>

        {/* Class List */}
        <div className="xl:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Class List</h2>
              </div>
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1 rounded-full">
                <span className="text-slate-600 text-sm font-medium">
                  Total Classes: {classes.length}
                </span>
              </div>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏫</span>
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No Classes Found</h3>
                <p className="text-slate-500">Create your first class using the form on the left.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    className="bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">🎓</span>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg text-slate-800">
                            {cls.name} - Section {cls.section}
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-xs">👩‍🏫</span>
                            Teacher: {cls.teacherId?.personalInfo?.name || "Unassigned"}
                          </span>
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        {cls.academicYear}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-600">Capacity</span>
                        <span className="text-xs font-medium text-slate-800">
                          {cls.students?.length || 0}/{cls.capacity || 20}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              ((cls.students?.length || 0) /
                                (cls.capacity || 20)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]"
                        onClick={() => openAddStudentsModal(cls._id)}
                      >
                        ➕ Add Students
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                        onClick={() => openViewStudentsModal(cls._id, cls.name)}
                        disabled={!cls.students || cls.students.length === 0}
                      >
                        👥 View Students
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Students Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">➕</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Add Students to Class</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {students.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">👥</span>
                  </div>
                  <p className="text-slate-500">No unassigned students available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      onClick={() => {
                        if (selectedStudents.includes(student._id)) {
                          setSelectedStudents(
                            selectedStudents.filter((id) => id !== student._id)
                          );
                        } else {
                          setSelectedStudents([
                            ...selectedStudents,
                            student._id,
                          ]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        id={student._id}
                        checked={selectedStudents.includes(student._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([
                              ...selectedStudents,
                              student._id,
                            ]);
                          } else {
                            setSelectedStudents(
                              selectedStudents.filter(
                                (id) => id !== student._id
                              )
                            );
                          }
                        }}
                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={student._id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-slate-800">
                          {student.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          ID: {student._id.slice(-6)}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white px-4 py-3 rounded-xl transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignStudents}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                  disabled={selectedStudents.length === 0 || loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
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
                      Adding...
                    </span>
                  ) : (
                    `Add ${selectedStudents.length} Students`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Students in {currentClassName}</h3>
                    <p className="text-sm text-slate-500">{classStudents.length} students enrolled</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {classStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">No Students Enrolled</h3>
                  <p className="text-slate-500">No students enrolled in this class yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {classStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:from-slate-100 hover:to-blue-100 transition-all duration-200"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-white shadow-md"
                          src={student.image}
                          alt={student.name}
                          onError={(e) => {
                            e.target.src = "/default-student.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          ID: {student.id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200">
              <button
                onClick={() => setViewModalOpen(false)}
                className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;