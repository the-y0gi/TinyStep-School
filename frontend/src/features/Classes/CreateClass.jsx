
import { useState, useEffect } from "react";
import { classAPI, teacherAPI } from "../../services/adminAllAPI's";

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: "",
    section: "A",
    capacity: 20,
    teacherId: "",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await teacherAPI.getAllTeachers();
        setTeachers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate academic year format (YYYY-YYYY)
      if (!/^\d{4}-\d{4}$/.test(formData.academicYear)) {
        alert("Academic year must be in format YYYY-YYYY (e.g., 2023-2024)");
        return;
      }
      
      // Validate capacity (must be positive number)
      if (formData.capacity <= 0) {
        alert("Capacity must be a positive number");
        return;
      }

      // Validate teacher selection
      if (formData.teacherId && !teachers.some((t) => t._id === formData.teacherId)) {
        alert("Please select a valid teacher");
        return;
      }

      await classAPI.createClass(formData);
      alert("Class created successfully!");
      setFormData({
        name: "",
        section: "A",
        capacity: 20,
        teacherId: "",
        academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Create New Class</h2>
      <form onSubmit={handleSubmit}>
        {/* CLASS NAME DROPDOWN */}
        <div className="mb-3">
          <label className="block mb-1">Class Name</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        {/* SECTION DROPDOWN */}
        <div className="mb-3">
          <label className="block mb-1">Section</label>
          <select
            className="w-full p-2 border rounded"
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

        {/* CAPACITY INPUT */}
        <div className="mb-3">
          <label className="block mb-1">Class Capacity</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border rounded"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        {/* TEACHER DROPDOWN */}
        <div className="mb-3">
          <label className="block mb-1">Assign Teacher</label>
          <select
            className="w-full p-2 border rounded"
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

        {/* ACADEMIC YEAR INPUT */}
        <div className="mb-3">
          <label className="block mb-1">Academic Year</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default CreateClass;