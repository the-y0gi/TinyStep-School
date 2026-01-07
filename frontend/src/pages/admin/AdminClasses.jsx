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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Class Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Class Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Create New Class
          </h2>
          <form onSubmit={handleCreateClass}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Class Name</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Section</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Class Capacity</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Assign Teacher</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
            >
              Create Class
            </button>
          </form>
        </div>

        {/* Class List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Class List
              </h2>
              <div className="text-gray-500">
                Total Classes: {classes.length}
              </div>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No classes found. Create your first class using the form.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {cls.name} - Section {cls.section}
                        </h3>
                        <p className="text-gray-600">
                          Teacher:{" "}
                          {cls.teacherId?.personalInfo?.name || "Unassigned"}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {cls.academicYear}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
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
                      <span className="ml-2 text-sm text-gray-600">
                        {cls.students?.length || 0}/{cls.capacity || 20}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition duration-200"
                        onClick={() => openAddStudentsModal(cls._id)}
                      >
                        Add Students
                      </button>
                      <button
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm transition duration-200"
                        onClick={() => openViewStudentsModal(cls._id, cls.name)}
                        disabled={!cls.students || cls.students.length === 0}
                      >
                        View Students
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                Add Students to Class
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
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

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4 max-h-[60vh] overflow-y-auto">
              {students.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No unassigned students available
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
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
                        <div className="font-medium text-gray-800">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student._id.slice(-6)}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStudents}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 disabled:opacity-50"
                disabled={selectedStudents.length === 0 || loading}
              >
                {loading ? (
                  <span className="flex items-center">
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
      )}

      {/* View Students Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                Students in {currentClassName}
              </h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <div className="space-y-4">
              {classStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students enrolled in this class
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {classStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={student.image}
                          alt={student.name}
                          onError={(e) => {
                            e.target.src = "/default-student.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          ID: {student.id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
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
