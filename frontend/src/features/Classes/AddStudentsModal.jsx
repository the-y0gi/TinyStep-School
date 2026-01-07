import { classAPI, getAllStudents } from "../../services/adminAllAPI's";
import { useState, useEffect } from "react";

const AddStudentsModal = ({ classId, onClose }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        const allStudents = Array.isArray(res.data.data) ? res.data.data : [];
        
        // Filter students who are not assigned to any class or are inactive
        const unassigned = allStudents.filter(
          (s) => !s.classInfo?.current?.classId && s.status === 'active'
        );
        setStudents(unassigned);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load students. Please try again.");
      }
    };
    fetchStudents();
  }, []);

  const handleAssign = async () => {
    if (selectedStudents.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await classAPI.addStudentsToClass(classId, selectedStudents);
      alert(`${selectedStudents.length} students added successfully!`);
      onClose(true); // Pass true to indicate success
    } catch (err) {
      console.error("Error adding students:", err);
      setError(err.response?.data?.message || "Failed to add students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Add Students to Class</h3>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4 max-h-[60vh] overflow-y-auto">
          {students.length === 0 ? (
            <p>No unassigned students available</p>
          ) : (
            students.map((student) => (
              <div key={student._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={student._id}
                  checked={selectedStudents.includes(student._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents([...selectedStudents, student._id]);
                    } else {
                      setSelectedStudents(
                        selectedStudents.filter((id) => id !== student._id)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={student._id} className="cursor-pointer">
                  {student.name} (ID: {student._id.slice(-6)})
                </label>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={selectedStudents.length === 0 || loading}
          >
            {loading ? 'Adding...' : `Add ${selectedStudents.length} Students`}
          </button>
        </div>
      </div>
    </div>
  );
};
 export default AddStudentsModal;
