import { teacherAPI } from "../../services/adminAllAPI's";
import { useState, useEffect } from "react";
import AssignClassModal from "./AssignClassModal";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getAllTeachers();
      setTeachers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Teachers</h2>
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Assigned Classes</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="p-2 border">{teacher.personalInfo?.name || "N/A"}</td>
              <td className="p-2 border">{teacher.email || "N/A"}</td>
              <td className="p-2 border">
                {teacher.teacherDetails?.assignedClasses?.length > 0 ? (
                  <ul>
                    {teacher.teacherDetails.assignedClasses.map((cls, idx) => (
                      <li key={idx}>
                        {cls.classId?.name} ({cls.classId?.section})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No classes"
                )}
              </td>
              <td className="p-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedTeacher(teacher._id);
                    setShowModal(true);
                  }}
                >
                  Assign Class
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedTeacher && (
        <AssignClassModal
          teacherId={selectedTeacher}
          onClose={() => setShowModal(false)}
          onClassAssigned={fetchTeachers} // 👈 pass this down
        />
      )}
    </div>
  );
};

export default TeacherList;
