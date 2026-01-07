
import { useState } from 'react';

export default function CreateClassModal({ isOpen, onClose, onCreate }) {
  const [classData, setClassData] = useState({
    name: '',
    section: 'A',
    teacherId: ''
  });

  // Mock teachers - Replace with API call
  const teachers = [
    { id: '1', name: 'Ms. Gupta' },
    { id: '2', name: 'Mr. Singh' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(classData);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Class</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Class Name</label>
            <select
              value={classData.name}
              onChange={(e) => setClassData({...classData, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Class</option>
              <option value="Nursery">Nursery</option>
              <option value="Pre-KG">Pre-KG</option>
              <option value="KG">KG</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Section</label>
            <select
              value={classData.section}
              onChange={(e) => setClassData({...classData, section: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Assigned Teacher</label>
            <select
              value={classData.teacherId}
              onChange={(e) => setClassData({...classData, teacherId: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}