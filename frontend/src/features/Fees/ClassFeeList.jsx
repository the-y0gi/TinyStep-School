
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";

const ClassFeeList = () => {
  const [classFees, setClassFees] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axiosInstance.get("/admin/classes");
        const all = res.data.data;

        const uniqueMap = new Map();

        for (let cls of all) {
          const name = cls.name;
          const fee = cls.feeStructure || {};

          // Only keep first occurrence with feeStructure (ignore empty ones)
          if (!uniqueMap.has(name) && Object.keys(fee).length > 0) {
            uniqueMap.set(name, cls);
          }
        }

        const uniqueClassList = Array.from(uniqueMap.values());
        setClassFees(uniqueClassList);
      } catch (err) {
        console.error("Error fetching class fee data:", err);
      }
    };

    fetchFees();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">All Class Fee Structures</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">Annual Fee</th>
              <th className="px-4 py-2 border">Tuition Fee</th>
              <th className="px-4 py-2 border">Admission Fee</th>
              <th className="px-4 py-2 border">Other Charges</th>
            </tr>
          </thead>
          <tbody>
            {classFees.map((cls) => {
              const fee = cls.feeStructure || {};
              return (
                <tr key={cls._id} className="text-center">
                  <td className="border px-4 py-2">{cls.name}</td>
                  <td className="border px-4 py-2">{fee.annualFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.tuitionFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.admissionFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.otherCharges || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassFeeList;
