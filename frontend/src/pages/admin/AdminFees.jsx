import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";

const AdminFees = () => {
  // Shared states
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("REGULAR");

  // Regular Fees (SetClassFees)
  const [regularFees, setRegularFees] = useState([]);
  const [regularFeeForm, setRegularFeeForm] = useState({
    classId: "",
    annualFee: 5000,
    tuitionFee: 11250,
    admissionFee: 5000,
    otherCharges: 2500,
  });
  const [showRegularModal, setShowRegularModal] = useState(false);
  const [isEditingRegularFee, setIsEditingRegularFee] = useState(false);

  // One-Time Fees (AddOneTimeFee)
  const [oneTimeFees, setOneTimeFees] = useState([]);
  const [oneTimeFeeForm, setOneTimeFeeForm] = useState({
    classId: "",
    feeName: "",
    amount: "",
    dueDate: "",
  });
  const [showOneTimeModal, setShowOneTimeModal] = useState(false);

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesRes, regularRes, oneTimeRes] = await Promise.all([
          axiosInstance.get("/admin/classes"),
          axiosInstance.get("/admin/fees/get-class-fees"),
          axiosInstance.get("/admin/fees/one-time-fees"),
        ]);

        setClasses(classesRes.data?.data || []);

        // Transform regular fees data to match your UI structure
        const transformedRegularFees =
          regularRes.data?.classes?.map((cls) => ({
            classId: cls._id,
            annualFee: cls.feeStructure?.annualFee || 0,
            tuitionFee: cls.feeStructure?.tuitionFee || 0,
            admissionFee: cls.feeStructure?.admissionFee || 0,
            otherCharges: cls.feeStructure?.otherCharges || 0,
          })) || [];

        setRegularFees(transformedRegularFees);
        setOneTimeFees(oneTimeRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle class selection change in regular fee modal
  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    const existingFee = regularFees.find(
      (fee) => fee.classId === selectedClassId
    );

    if (existingFee) {
      setRegularFeeForm({
        classId: existingFee.classId,
        annualFee: existingFee.annualFee,
        tuitionFee: existingFee.tuitionFee,
        admissionFee: existingFee.admissionFee,
        otherCharges: existingFee.otherCharges,
      });
      setIsEditingRegularFee(true);
    } else {
      setRegularFeeForm({
        classId: selectedClassId,
        annualFee: 50000,
        tuitionFee: 11250,
        admissionFee: 5000,
        otherCharges: 2500,
      });
      setIsEditingRegularFee(false);
    }
  };

  // Regular Fees Handlers
  const handleRegularSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = isEditingRegularFee
        ? "/admin/fees/edit-class-fees"
        : "/admin/fees/set-class-fees";

      const res = await axiosInstance.post(endpoint, regularFeeForm);
      alert(res.data.message);
      setShowRegularModal(false);
      fetchRegularFees();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save fees");
    } finally {
      setLoading(false);
    }
  };

  // One-Time Fees Handlers
  const handleOneTimeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/admin/fees/add-one-time-fee",
        oneTimeFeeForm
      );
      alert(`${res.data.message}\nAmount: ₹${res.data.amount}`);
      setShowOneTimeModal(false);
      fetchOneTimeFees();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add fee");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegularFees = async () => {
    try {
      const res = await axiosInstance.get("/admin/fees/get-class-fees");

      // Transform the data to match your UI expectations
      const transformedFees = res.data.classes.map((cls) => ({
        classId: cls._id,
        annualFee: cls.feeStructure?.annualFee || 0,
        tuitionFee: cls.feeStructure?.tuitionFee || 0,
        admissionFee: cls.feeStructure?.admissionFee || 0,
        otherCharges: cls.feeStructure?.otherCharges || 0,
      }));

      setRegularFees(transformedFees);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load fees");
    }
  };

  const fetchOneTimeFees = async () => {
    const res = await axiosInstance.get("/admin/fees/one-time-fees");
    setOneTimeFees(res.data?.data || []);
  };

  const getClassNameById = (id) => {
    return classes.find((c) => c._id === id)?.name || "N/A";
  };

  // Combined UI Components
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Fee Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage regular and one-time fees for all classes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">System Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 relative ${
                activeTab === "REGULAR"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
              onClick={() => setActiveTab("REGULAR")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Regular Fees
              </div>
              {activeTab === "REGULAR" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
            <button
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 relative ${
                activeTab === "ONETIME"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
              onClick={() => setActiveTab("ONETIME")}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                One-Time Fees
              </div>
              {activeTab === "ONETIME" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Conditional Content */}
        {activeTab === "REGULAR" ? (
          <div className="space-y-6">
            {/* Regular Fees Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Class Fee Structures
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Set up annual, tuition, admission and other fees for each
                    class
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRegularFeeForm({
                      classId: "",
                      annualFee: 50000,
                      tuitionFee: 11250,
                      admissionFee: 5000,
                      otherCharges: 2500,
                    });
                    setIsEditingRegularFee(false);
                    setShowRegularModal(true);
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add/Edit Fees
                </button>
              </div>
            </div>

            {/* Regular Fees Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">
                  Fee Structure Overview
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Annual Fee
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Tuition Fee
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Admission Fee
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Other Charges
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {regularFees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <svg
                              className="w-16 h-16 text-slate-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <div>
                              <h3 className="text-lg font-medium text-slate-700 mb-1">
                                No fee structures found
                              </h3>
                              <p className="text-slate-500">
                                Click "Add/Edit Fees" to set up fee structures
                                for classes
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      regularFees.map((fee, index) => (
                        <tr
                          key={fee.classId}
                          className={`hover:bg-slate-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-25"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                {getClassNameById(fee.classId).charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800">
                                {getClassNameById(fee.classId)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-lg font-bold text-green-600">
                              ₹{fee.annualFee.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-lg font-bold text-blue-600">
                              ₹{fee.tuitionFee.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-lg font-bold text-purple-600">
                              ₹{fee.admissionFee.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-lg font-bold text-orange-600">
                              ₹{fee.otherCharges.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regular Fee Modal */}
            {showRegularModal && (
              <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {isEditingRegularFee
                            ? "Edit Class Fees"
                            : "Set Class Fees"}
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Configure fee structure for the selected class
                        </p>
                      </div>
                      <button
                        onClick={() => setShowRegularModal(false)}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleRegularSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Select Class
                        </label>
                        <select
                          value={regularFeeForm.classId}
                          onChange={handleClassChange}
                          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        >
                          <option value="">Choose a class...</option>
                          {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            field: "annualFee",
                            label: "Annual Fee",
                            color: "green",
                          },
                          {
                            field: "tuitionFee",
                            label: "Tuition Fee",
                            color: "blue",
                          },
                          {
                            field: "admissionFee",
                            label: "Admission Fee",
                            color: "purple",
                          },
                          {
                            field: "otherCharges",
                            label: "Other Charges",
                            color: "orange",
                          },
                        ].map(({ field, label, color }) => (
                          <div key={field}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              {label}
                            </label>
                            <div className="relative">
                              <span
                                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-${color}-600 font-bold`}
                              >
                                ₹
                              </span>
                              <input
                                type="number"
                                value={regularFeeForm[field]}
                                onChange={(e) =>
                                  setRegularFeeForm({
                                    ...regularFeeForm,
                                    [field]: e.target.value,
                                  })
                                }
                                className="w-full pl-8 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                                required
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
                      >
                        {loading
                          ? "Saving..."
                          : isEditingRegularFee
                          ? "Update Fees"
                          : "Save Fees"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* One-Time Fees Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    One-Time Fees
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Add special fees like sports fee, lab fee, etc.
                  </p>
                </div>
                <button
                  onClick={() => setShowOneTimeModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Fee
                </button>
              </div>
            </div>

            {/* One-Time Fees Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">
                  Special Fees Overview
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Fee Name
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {oneTimeFees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <svg
                              className="w-16 h-16 text-slate-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <div>
                              <h3 className="text-lg font-medium text-slate-700 mb-1">
                                No one-time fees found
                              </h3>
                              <p className="text-slate-500">
                                Click "Add New Fee" to create special fees
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      oneTimeFees.map((fee, index) => (
                        <tr
                          key={fee._id}
                          className={`hover:bg-slate-50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-25"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                {getClassNameById(fee.classId).charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800">
                                {getClassNameById(fee.classId)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                  />
                                </svg>
                              </div>
                              <span className="font-medium text-slate-800">
                                {fee.feeName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-xl font-bold text-green-600">
                              ₹{Number(fee.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* One-Time Fee Modal */}
            {showOneTimeModal && (
              <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          Add One-Time Fee
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Create a special fee for specific classes
                        </p>
                      </div>
                      <button
                        onClick={() => setShowOneTimeModal(false)}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleOneTimeSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Select Class
                        </label>
                        <select
                          value={oneTimeFeeForm.classId}
                          onChange={(e) =>
                            setOneTimeFeeForm({
                              ...oneTimeFeeForm,
                              classId: e.target.value,
                            })
                          }
                          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white"
                          required
                        >
                          <option value="">Choose a class...</option>
                          {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Fee Name
                        </label>
                        <input
                          type="text"
                          value={oneTimeFeeForm.feeName}
                          onChange={(e) =>
                            setOneTimeFeeForm({
                              ...oneTimeFeeForm,
                              feeName: e.target.value,
                            })
                          }
                          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                          required
                          placeholder="e.g., Sports Fee, Lab Fee, Field Trip"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-bold text-lg">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={oneTimeFeeForm.amount}
                            onChange={(e) =>
                              setOneTimeFeeForm({
                                ...oneTimeFeeForm,
                                amount: e.target.value,
                              })
                            }
                            className="w-full pl-8 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                            required
                            min="0"
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={oneTimeFeeForm.dueDate}
                          onChange={(e) =>
                            setOneTimeFeeForm({
                              ...oneTimeFeeForm,
                              dueDate: e.target.value,
                            })
                          }
                          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
                      >
                        {loading ? "Adding Fee..." : "Add Fee"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFees;
