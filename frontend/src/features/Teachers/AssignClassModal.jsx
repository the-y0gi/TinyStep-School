import { teacherAPI } from "../../services/adminAllAPI's";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosConfig";

const AssignClassModal = ({ teacherId, onClose, onClassAssigned }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
}, [teacherId]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("/admin/classes");
        setClasses(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleAssign = async () => {
    try {
      await teacherAPI.assignClassToTeacher(teacherId, selectedClass);
      alert("Class assigned successfully!");
      onClassAssigned(); // 👈 re-fetch teachers
      onClose();
    } catch (error) {
      alert("Failed to assign class: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="font-bold text-lg mb-4">Assign Class</h3>
        <select
          className="w-full p-2 mb-4 border rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} (Section: {cls.section})
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!selectedClass}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignClassModal;
