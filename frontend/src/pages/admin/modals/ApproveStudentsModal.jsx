// components/modals/ApproveStudentsModal.jsx
import { useState } from 'react';

export default function ApproveStudentsModal({ isOpen, onClose, onApprove }) {
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Mock data - Replace with API call to fetch pending students
  const pendingStudents = [
    { id: 1, name: 'Rahul Sharma', parent: 'Mrs. Sharma' },
    { id: 2, name: 'Priya Patel', parent: 'Mr. Patel' }
  ];

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Approve Students</h2>
        
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {pendingStudents.map(student => (
            <div key={student.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudentSelection(student.id)}
                className="mr-2"
              />
              <span>{student.name} (Parent: {student.parent})</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button 
            onClick={() => onApprove(selectedStudents)}
            disabled={selectedStudents.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Approve Selected ({selectedStudents.length})
          </button>
        </div>
      </div>
    </div>
  );
}