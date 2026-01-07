import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';

const FeeSummary = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/admin/get-fees');

        // Group data by className
        const grouped = {};
        res.data.forEach((fee) => {
          const className = fee.className || 'Unknown';

          if (!grouped[className]) {
            grouped[className] = {
              totalPotential: 0,
              totalCollected: 0,
              totalStudents: 0,
              paidStudents: 0,
              fees: []
            };
          }

          // Update totals
          grouped[className].totalPotential += fee.totalPotential || 0;
          grouped[className].totalCollected += fee.totalCollected || 0;
          grouped[className].totalStudents += fee.totalStudents || 0;
          grouped[className].paidStudents += fee.paidStudents || 0;

          // Push individual fee type
          grouped[className].fees.push({
            name: fee.name,
            potential: fee.totalPotential || 0,
            collected: fee.totalCollected || 0,
            pending: (fee.totalPotential || 0) - (fee.totalCollected || 0)
          });
        });

        setGroupedData(grouped);
      } catch (err) {
        console.error(err);
        setError('Failed to load fee data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading fee data...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-8">
      {Object.entries(groupedData).map(([className, group]) => {
        const pendingAmount = group.totalPotential - group.totalCollected;
        const pendingStudents = group.totalStudents - group.paidStudents;

        return (
          <div key={className} className="bg-white shadow rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Total Annual Fees of {className}: ₹{group.totalPotential.toLocaleString('en-IN')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {group.paidStudents} student(s) paid, {pendingStudents} pending
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border rounded">
                <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-2">Fee Type</th>
                    <th className="px-4 py-2">Potential</th>
                    <th className="px-4 py-2">Collected</th>
                    <th className="px-4 py-2">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {group.fees.map((fee, idx) => (
                    <tr key={fee.name + idx}>
                      <td className="px-4 py-2">{fee.name}</td>
                      <td className="px-4 py-2 font-mono">₹{fee.potential.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-green-700 font-mono">₹{fee.collected.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-red-600 font-mono">₹{fee.pending.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeeSummary;
