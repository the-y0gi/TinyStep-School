import { classAPI } from "../../services/adminAllAPI's";
import { useState, useEffect } from "react";

const ClassList = ({ onAddStudents }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classAPI.getAllClasses();
        setClasses(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {classes.map((cls) => (
        <div
          key={cls._id}
          className="border rounded-lg p-4 shadow hover:shadow-md"
        >
          <h3 className="font-bold text-lg">
            {cls.name} - Section {cls.section}
          </h3>
          <p>Teacher: {cls.teacherId?.personalInfo?.name || "Unassigned"}</p>

          <p>
            Students: {cls.students?.length || 0}/{cls.capacity || 20}
          </p>
          <button
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => onAddStudents(cls._id)}
          >
            Add Students
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClassList;
