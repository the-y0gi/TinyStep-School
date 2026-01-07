import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
// import api from '../../../services/api';

const OverdueFeesTable = () => {
  const [overdueFees, setOverdueFees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/admin/fees/overdue-fees');
        setOverdueFees(res.data);
      } catch (err) {
        console.error("Failed to fetch overdue fees:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto mt-6 bg-white rounded shadow">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left text-sm font-semibold">Student</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold">Fee Type</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold">Amount (₹)</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {overdueFees.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No overdue fees found.
              </td>
            </tr>
          ) : (
            overdueFees.map((fee) => (
              <tr key={fee._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{fee.studentId?.name || 'N/A'}</td>
                <td className="border px-4 py-2">{fee.feeItems?.[0]?.name || 'N/A'}</td>
                <td className="border px-4 py-2">₹{fee.feeItems?.[0]?.amount || 0}</td>
                <td className="border px-4 py-2">
                  {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OverdueFeesTable;
