import { useEffect, useState } from "react";
import { getStudents } from "../../services/adminAllAPI's";
import { useNavigate } from "react-router-dom";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      if (res.data && res.data.success) {
        setStudents(res.data.data);
      } else {
        console.error("Failed to fetch students: Invalid response structure");
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <div className="p-6">Loading students...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Admissions</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Class</th>
                <th className="p-2">Section</th>
                <th className="p-2">Parent</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">
                    {student.classInfo?.current?.className || "N/A"}
                  </td>
                  <td className="p-2">
                    {student.classInfo?.current?.section || "N/A"}
                  </td>
                  <td className="p-2">
                    {student.parentInfo?.name || "N/A"}
                  </td>
                  <td className="p-2">
                    {student.parentInfo?.phone || "N/A"}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : student.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => navigate(`/admin/students/${student._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}