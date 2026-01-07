import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";

const SetClassFees = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [uniqueClassMap, setUniqueClassMap] = useState(new Map());
  const [formData, setFormData] = useState({
    classId: "",
    annualFee: 50000,
    tuitionFee: 11250,
    admissionFee: 5000,
    otherCharges: 2500,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      const res = await axiosInstance.get("/admin/classes");
      const classList = res.data.data;

      const uniqueMap = new Map();
      for (let cls of classList) {
        const name = cls.name;
        const fee = cls.feeStructure || {};
        if (!uniqueMap.has(name) && Object.keys(fee).length > 0) {
          uniqueMap.set(name, cls);
        }
      }

      setAllClasses(classList);
      setUniqueClassMap(uniqueMap);
    } catch (err) {
      console.error("Error fetching class fee data:", err);
    }
  };

  const handleEdit = (cls) => {
    const fee = cls.feeStructure || {};
    setFormData({
      classId: cls._id,
      annualFee: fee.annualFee || 50000,
      tuitionFee: fee.tuitionFee || 11250,
      admissionFee: fee.admissionFee || 5000,
      otherCharges: fee.otherCharges || 2500,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      classId: "",
      annualFee: 50000,
      tuitionFee: 11250,
      admissionFee: 5000,
      otherCharges: 2500,
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      classId: "",
      annualFee: 50000,
      tuitionFee: 11250,
      admissionFee: 5000,
      otherCharges: 2500,
    });
  };

  const handleClassChange = (e) => {
    const selectedClassName = e.target.value;
    const matchedClass = allClasses.find((cls) => cls.name === selectedClassName);

    if (matchedClass) {
      const fee = matchedClass.feeStructure || {};
      setFormData({
        classId: matchedClass._id,
        annualFee: fee.annualFee || 50000,
        tuitionFee: fee.tuitionFee || 11250,
        admissionFee: fee.admissionFee || 5000,
        otherCharges: fee.otherCharges || 2500,
      });
      setIsEditMode(Object.keys(fee).length > 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditMode
        ? "/admin/fees/edit-class-fees"
        : "/admin/fees/set-class-fees";

      const res = await axiosInstance.post(endpoint, formData);
      alert(res.data.message || "Fee structure saved!");
      await fetchClassData();
      setIsEditMode(false);
      setShowModal(false);
      setFormData({
        classId: "",
        annualFee: 50000,
        tuitionFee: 11250,
        admissionFee: 5000,
        otherCharges: 2500,
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const uniqueClasses = Array.from(uniqueClassMap.values());

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">All Class Fee Structures</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
          onClick={handleAddClick}
        >
          Add Class Fee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">Annual Fee</th>
              <th className="px-4 py-2 border">Tuition Fee</th>
              <th className="px-4 py-2 border">Admission Fee</th>
              <th className="px-4 py-2 border">Other Charges</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uniqueClasses.map((cls) => {
              const fee = cls.feeStructure || {};
              return (
                <tr key={cls._id} className="text-center">
                  <td className="border px-4 py-2">{cls.name}</td>
                  <td className="border px-4 py-2">{fee.annualFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.tuitionFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.admissionFee || "-"}</td>
                  <td className="border px-4 py-2">{fee.otherCharges || "-"}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                {isEditMode ? "Edit Fee Structure" : "Set New Fee Structure"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Select Class</span>
                  <select
                    value={
                      allClasses.find((c) => c._id === formData.classId)?.name || ""
                    }
                    onChange={handleClassChange}
                    required
                    className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isEditMode}
                  >
                    <option value="">-- Select Class --</option>
                    {Array.from(new Set(allClasses.map((cls) => cls.name))).map(
                      (name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      )
                    )}
                  </select>
                </label>

                {["annualFee", "tuitionFee", "admissionFee", "otherCharges"].map(
                  (field) => (
                    <label className="block" key={field}>
                      <span className="text-gray-700 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </span>
                      <input
                        type="number"
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </label>
                  )
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 ${
                      isEditMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    } text-white py-2 rounded transition`}
                  >
                    {isEditMode ? "Update Fees" : "Set Fees"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetClassFees;