
import { useState } from 'react';
import Loader from '../../../components/Loader';

export default function StudentApprovalTable({ 
  students = [], 
  onApprove, 
  onReject,
  loading = false,
  error = null
}) {
  const [filter, setFilter] = useState('pending');
  const [selectedIds, setSelectedIds] = useState([]);

  // Safely handle non-array students prop
  const studentList = Array.isArray(students) ? students : [];
  const filteredStudents = studentList.filter(
    student => student.status === filter || filter === 'all'
  );

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <Loader />;

  if (studentList.length === 0) return <div className="text-center py-8 text-gray-500">No students found</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filter Controls */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div>
          <select 
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSelectedIds([]); // Reset selection on filter change
            }}
            className="border p-2 rounded"
          >
            <option value="all">All Students</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => {
                onApprove(selectedIds);
                setSelectedIds([]);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Approve Selected
            </button>
            <button
              onClick={() => {
                onReject(selectedIds);
                setSelectedIds([]);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Reject Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={() => {
                    if (selectedIds.length === filteredStudents.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredStudents.map(s => s.id));
                    }
                  }}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Parent</th>
              <th className="p-3">Class</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student.id)}
                    onChange={() => toggleSelection(student.id)}
                  />
                </td>
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3">{student.parent}</td>
                <td className="p-3">{student.class || 'Not assigned'}</td>
                <td className="p-3">
                  <StatusBadge status={student.status} />
                </td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button 
                    onClick={() => onApprove([student.id])}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onReject([student.id])}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}