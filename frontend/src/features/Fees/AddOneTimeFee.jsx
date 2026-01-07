import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';

const AddOneTimeFee = () => {
  // State management
  const [formData, setFormData] = useState({
    classId: '',
    feeName: '',
    amount: '',
    dueDate: ''
  });
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchClasses(), fetchOneTimeFees()]);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Data loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // API calls
  const fetchClasses = async () => {
    const res = await axiosInstance.get('/admin/classes');
    setClasses(res.data?.data || []);
  };

  const fetchOneTimeFees = async () => {
    const res = await axiosInstance.get('/admin/fees/one-time-fees');
    setFees(res.data?.data || []);
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e) => {
    const selectedClass = classes.find(cls => cls.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      classId: selectedClass?._id || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/admin/fees/add-one-time-fee', formData);
      
      alert(`${res.data.message}\nTotal Amount: ₹${res.data.totalAmount}`);
      resetForm();
      await fetchOneTimeFees();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add fee. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      classId: '',
      feeName: '',
      amount: '',
      dueDate: ''
    });
    setError(null);
  };

  // Helper functions
  const getClassNameById = (id) => {
    return classes.find(cls => cls._id === id)?.name || 'N/A';
  };

  const getUniqueClassNames = () => {
    return [...new Set(classes.map(cls => cls.name))];
  };

  // Render functions
  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Add One-Time Fee</h3>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              name="class"
              value={classes.find(c => c._id === formData.classId)?.name || ''}
              onChange={handleClassChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a class</option>
              {getUniqueClassNames().map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Name
            </label>
            <input
              type="text"
              name="feeName"
              value={formData.feeName}
              onChange={handleInputChange}
              placeholder="e.g., Sports Fee"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Add Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFeeTable = () => {
    if (isLoading && fees.length === 0) {
      return <div className="text-center py-8">Loading fees...</div>;
    }

    if (fees.length === 0) {
      return <div className="text-center py-8 text-gray-500">No one-time fees found.</div>;
    }

    return (
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fees.map((fee, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getClassNameById(fee.classId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.feeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{fee.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">One-Time Fees</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Fee
        </button>
      </div>

      {renderFeeTable()}
      {isModalOpen && renderModal()}
    </div>
  );
};

export default AddOneTimeFee;