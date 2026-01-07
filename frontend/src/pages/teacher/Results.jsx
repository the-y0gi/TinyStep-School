import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
import { 
  Plus, BookOpen, Users, Calendar, FileText, Save, Trash2, X, 
  Eye, List, Search, Download, ChevronDown, ChevronUp, Filter, Menu
} from "lucide-react";

const Results = () => {
  // State initialization with proper defaults
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    classId: "",
    examType: "",
    examDate: "",
    subjects: [],
    results: []
  });
  
  // View results state
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedResults, setUploadedResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ 
    key: "examDate", 
    direction: "desc" 
  });
  const [expandedResult, setExpandedResult] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Fetch classes with error handling
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/teacher/classes/dropdown");
        if (res?.data) {
          setClasses(res.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Fetch classes error:", err);
        setError("Failed to load classes. Please try again.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch results with error handling
  useEffect(() => {
    const fetchUploadedResults = async () => {
      if (activeTab !== "view") return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/teacher/results");
        if (Array.isArray(res?.data)) {
          setUploadedResults(res.data);
          setFilteredResults(res.data);
        } else {
          throw new Error("Invalid results data format");
        }
      } catch (err) {
        console.error("Fetch results error:", err);
        setError("Failed to load results. Please try again.");
        setUploadedResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUploadedResults();
  }, [activeTab]);

  // Safe filtering and sorting
  useEffect(() => {
    try {
      let results = [...(uploadedResults || [])];
      
      // Safe filtering
      if (searchTerm) {
        results = results.filter(result => {
          const classMatch = result?.classId?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
          const examMatch = result?.examType?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
          const studentMatch = result?.results?.some(r => 
            r?.studentId?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
          ) || false;
          
          return classMatch || examMatch || studentMatch;
        });
      }
      
      if (classFilter) {
        results = results.filter(result => result?.classId?._id === classFilter);
      }
      
      if (examTypeFilter) {
        results = results.filter(result => result?.examType === examTypeFilter);
      }
      
      if (dateFilter) {
        results = results.filter(result => result?.examDate === dateFilter);
      }
      
      // Safe sorting
      if (sortConfig?.key) {
        results.sort((a, b) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          
          if (aValue === undefined || bValue === undefined) return 0;
          
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredResults(results);
    } catch (err) {
      console.error("Filtering error:", err);
      setFilteredResults([]);
    }
  }, [uploadedResults, searchTerm, classFilter, examTypeFilter, dateFilter, sortConfig]);

  // Fetch students with error handling
  useEffect(() => {
    const fetchStudents = async () => {
      if (!form.classId) {
        setStudents([]);
        setForm(prev => ({ ...prev, results: [] }));
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/teacher/classes/${form.classId}/students`);
        const studentList = res?.data?.students || [];
        
        if (!Array.isArray(studentList)) {
          throw new Error("Invalid students data format");
        }
        
        setStudents(studentList);

        // Initialize results safely
        const initResults = studentList.map((student) => ({
          studentId: student?._id || "",
          marksObtained: Array(form.subjects.length).fill(0),
          teacherRemarks: ""
        }));
        
        setForm(prev => ({ 
          ...prev, 
          results: initResults 
        }));
      } catch (err) {
        console.error("Fetch students error:", err);
        setError("Failed to load students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [form.classId, form.subjects.length]);

  // Helper functions with validation
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...form.subjects];
    if (index >= 0 && index < updatedSubjects.length) {
      updatedSubjects[index][field] = value;
      setForm(prev => ({ ...prev, subjects: updatedSubjects }));
    }
  };

  const addSubject = () => {
    setForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", maxMarks: "" }]
    }));
  };

  const removeSubject = (index) => {
    if (index >= 0 && index < form.subjects.length) {
      const updatedSubjects = form.subjects.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, subjects: updatedSubjects }));
    }
  };

  const handleMarkChange = (studentIndex, subjectIndex, value) => {
    if (studentIndex >= 0 && studentIndex < students.length && 
        subjectIndex >= 0 && subjectIndex < form.subjects.length) {
      const updatedResults = [...form.results];
      
      if (!updatedResults[studentIndex]) {
        updatedResults[studentIndex] = {
          studentId: students[studentIndex]?._id || "",
          marksObtained: Array(form.subjects.length).fill(0),
          teacherRemarks: ""
        };
      }
      
      updatedResults[studentIndex].marksObtained[subjectIndex] = Number(value) || 0;
      setForm(prev => ({ ...prev, results: updatedResults }));
    }
  };

  const handleRemarkChange = (studentIndex, value) => {
    if (studentIndex >= 0 && studentIndex < students.length) {
      const updatedResults = [...form.results];
      
      if (!updatedResults[studentIndex]) {
        updatedResults[studentIndex] = {
          studentId: students[studentIndex]?._id || "",
          marksObtained: Array(form.subjects.length).fill(0),
          teacherRemarks: ""
        };
      }
      
      updatedResults[studentIndex].teacherRemarks = value;
      setForm(prev => ({ ...prev, results: updatedResults }));
    }
  };

  const calculateTotal = (studentIndex) => {
    if (!form.results[studentIndex]) return { obtained: 0, max: 0, percentage: 0 };
    
    const obtained = form.results[studentIndex].marksObtained.reduce(
      (sum, mark) => sum + (mark || 0), 0
    );
    
    const max = form.subjects.reduce(
      (sum, subj) => sum + (Number(subj.maxMarks) || 0), 0
    );
    
    const percentage = max > 0 ? ((obtained / max) * 100).toFixed(1) : 0;
    
    return { obtained, max, percentage };
  };

  // Form navigation with validation
  const proceedToNextStep = () => {
    try {
      if (currentStep === 1) {
        if (!form.classId || !form.examType || !form.examDate) {
          throw new Error("Please fill all exam information fields");
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if (form.subjects.length === 0) {
          throw new Error("Please add at least one subject");
        }
        const incompleteSubject = form.subjects.find(subj => !subj.name || !subj.maxMarks);
        if (incompleteSubject) {
          throw new Error("Please complete all subject information");
        }
        setCurrentStep(3);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const goBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Result submission with error handling
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate payload
      if (!form.classId || !form.examType || !form.examDate || 
          form.subjects.length === 0 || form.results.length === 0) {
        throw new Error("All required fields must be filled");
      }
      
      const payload = {
        classId: form.classId,
        examType: form.examType,
        examDate: form.examDate,
        subjects: form.subjects,
        results: form.results,
        submittedBy: "teacher_id_here" // Replace with actual teacher ID
      };
      
      const res = await axiosInstance.post("/teacher/results/upload", payload);
      
      if (!res.data) {
        throw new Error("No data received from server");
      }
      
      // Reset form
      setForm({
        classId: "",
        examType: "",
        examDate: "",
        subjects: [],
        results: []
      });
      setCurrentStep(1);
      setError(null);
      
      // Refresh view
      if (activeTab === "view") {
        const refreshRes = await axiosInstance.get("/teacher/results");
        setUploadedResults(refreshRes?.data || []);
        setFilteredResults(refreshRes?.data || []);
      }
      
      alert("Results uploaded successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to upload results");
    } finally {
      setLoading(false);
    }
  };

  // View results functions
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleResultDetails = (resultId) => {
    setExpandedResult(prev => prev === resultId ? null : resultId);
  };

  const downloadResult = async (resultId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/teacher/results/${resultId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result-${resultId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download result");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setClassFilter("");
    setExamTypeFilter("");
    setDateFilter("");
    setError(null);
  };

  // Derived data with null checks
  const selectedClass = classes.find(cls => cls?._id === form.classId) || null;
  const examTypes = [...new Set(uploadedResults.map(r => r?.examType).filter(Boolean))];
  
  // Render loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Results Management</h1>
          </div>
          <p className="text-gray-600">
            Upload and manage examination results for your classes
          </p>
          
          {/* Tabs */}
          <div className="mt-6 flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("upload");
                setError(null);
              }}
              className={`py-2 px-4 font-medium flex items-center gap-2 ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload Results</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("view");
                setError(null);
              }}
              className={`py-2 px-4 font-medium flex items-center gap-2 ${
                activeTab === "view"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>View Results</span>
            </button>
          </div>
        </div>

        {/* Upload Results Tab */}
        {activeTab === "upload" && (
          <>
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between space-x-4">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      <span className="ml-2 font-medium hidden sm:inline">
                        {step === 1 ? "Exam Info" : step === 2 ? "Subjects" : "Marks"}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Exam Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Exam Information
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Class *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.classId}
                      onChange={(e) => setForm({ ...form, classId: e.target.value })}
                      disabled={loading}
                    >
                      <option value="">Choose a class</option>
                      {classes.map((cls) => (
                        <option key={cls?._id} value={cls?._id}>
                          {cls?.name || 'Unnamed Class'} - Section {cls?.section || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
                    <input
                      type="text"
                      placeholder="e.g., Half-Yearly, Final, Unit Test"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.examType}
                      onChange={(e) => setForm({ ...form, examType: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.examDate}
                        onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={proceedToNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    Next: Add Subjects
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Subjects */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      Add Subjects
                    </h2>
                    {selectedClass && (
                      <span className="text-sm text-gray-600">
                        for {selectedClass?.name || 'Class'} - Section {selectedClass?.section || 'N/A'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={addSubject}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mt-2 sm:mt-0"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                </div>

                {form.subjects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No subjects added yet</p>
                    <p className="text-sm">Click "Add Subject" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {form.subjects.map((subj, idx) => (
                      <div key={idx} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                        <input
                          type="text"
                          placeholder="Subject Name"
                          value={subj.name}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onChange={(e) => handleSubjectChange(idx, "name", e.target.value)}
                          disabled={loading}
                        />
                        <div className="flex gap-3">
                          <input
                            type="number"
                            placeholder="Max Marks"
                            value={subj.maxMarks}
                            min="0"
                            max="100"
                            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            onChange={(e) => handleSubjectChange(idx, "maxMarks", e.target.value)}
                            disabled={loading}
                          />
                          <button
                            onClick={() => removeSubject(idx)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            disabled={loading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={goBackStep}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={proceedToNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    Next: Enter Marks
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Student Marks */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-purple-600" />
                    Enter Student Marks
                  </h2>
                  {selectedClass && (
                    <span className="text-sm text-gray-600">
                      ({selectedClass?.name || 'Class'} - Section {selectedClass?.section || 'N/A'})
                    </span>
                  )}
                </div>

                {/* Subjects Summary */}
                {form.subjects.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Subjects Overview:</h3>
                    <div className="flex flex-wrap gap-2">
                      {form.subjects.map((subj, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {subj?.name || 'Subject'} ({subj?.maxMarks || 0}m)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {students.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No students found</p>
                    <p className="text-sm">Please select a different class</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile/Tablet View */}
                    <div className="block xl:hidden space-y-4">
                      {students.map((student, sIdx) => {
                        const totals = calculateTotal(sIdx);
                        return (
                          <div key={student?._id || sIdx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-base truncate">
                                  {student?.name || 'Student'}
                                </h3>
                                {/* <p className="text-sm text-gray-600">Roll No: {student?.rollNo || 'N/A'}</p> */}
                              </div>
                              <div className="text-right ml-2">
                                <div className="text-sm font-medium text-gray-700">
                                  {totals.obtained}/{totals.max}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  totals.percentage >= 75 ? 'bg-green-100 text-green-800' :
                                  totals.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {totals.percentage}%
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {form.subjects.map((subj, subjIdx) => (
                                <div key={subjIdx} className="bg-white rounded p-3 border">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {subj?.name || 'Subject'}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      placeholder="0"
                                      min="0"
                                      max={subj?.maxMarks || 100}
                                      className="flex-1 border border-gray-300 rounded p-2 text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      onChange={(e) => handleMarkChange(sIdx, subjIdx, e.target.value)}
                                      disabled={loading}
                                    />
                                    <span className="text-sm text-gray-500">/{subj?.maxMarks || 0}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white rounded p-3 border">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                              <textarea
                                placeholder="Enter remarks..."
                                rows="2"
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                onChange={(e) => handleRemarkChange(sIdx, e.target.value)}
                                disabled={loading}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden xl:block overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-3 text-left font-semibold">Student</th>
                            {/* <th className="border border-gray-300 p-3 text-left font-semibold">Roll No</th> */}
                            {form.subjects.map((subj, idx) => (
                              <th key={idx} className="border border-gray-300 p-3 text-center font-semibold min-w-24">
                                {subj?.name || 'Subject'}
                                <br />
                                <span className="text-xs text-gray-600">/{subj?.maxMarks || 0}</span>
                              </th>
                            ))}
                            <th className="border border-gray-300 p-3 text-center font-semibold">Total</th>
                            <th className="border border-gray-300 p-3 text-center font-semibold">%</th>
                            <th className="border border-gray-300 p-3 text-left font-semibold min-w-48">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, sIdx) => {
                            const totals = calculateTotal(sIdx);
                            return (
                              <tr key={student?._id || sIdx} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-3 font-medium">
                                  {student?.name || 'Student'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {student?.rollNo || 'N/A'}
                                </td>
                                {form.subjects.map((subj, subjIdx) => (
                                  <td key={subjIdx} className="border border-gray-300 p-2">
                                    <input
                                      type="number"
                                      placeholder="0"
                                      min="0"
                                      max={subj?.maxMarks || 100}
                                      className="w-full border border-gray-300 rounded p-2 text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      onChange={(e) => handleMarkChange(sIdx, subjIdx, e.target.value)}
                                      disabled={loading}
                                    />
                                  </td>
                                ))}
                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                  {totals.obtained}/{totals.max}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                                    totals.percentage >= 75 ? 'bg-green-100 text-green-800' :
                                    totals.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {totals.percentage}%
                                  </span>
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <textarea
                                    placeholder="Enter remarks..."
                                    rows="1"
                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    onChange={(e) => handleRemarkChange(sIdx, e.target.value)}
                                    disabled={loading}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  <button
                    onClick={goBackStep}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    Back to Subjects
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
                    disabled={loading || students.length === 0}
                  >
                    <Save className="w-4 h-4" />
                    Submit Results
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View Results Tab */}
        {activeTab === "view" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <List className="w-6 h-6 text-blue-600" />
                    View Results
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Browse and manage previously uploaded results
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Clear Filters</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Filters</span>
                    <span className="sm:hidden">Filter</span>
                  </button>
                </div>
              </div>
              
              {/* Filters Section */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="col-span-1 sm:col-span-2 xl:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by class, exam or student"
                        className="w-full border border-gray-300 rounded-lg pl-10 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      {classes.map((cls) => (
                        <option key={cls?._id} value={cls?._id}>
                          {cls?.name || 'Class'} - Section {cls?.section || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={examTypeFilter}
                      onChange={(e) => setExamTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {examTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Results - Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {Array.isArray(filteredResults) && filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <div key={result?._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                          {result?.classId?.name || 'Class'} - {result?.classId?.section || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result?.examType || 'Exam'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result?.examDate ? new Date(result.examDate).toLocaleDateString() : 'No date'} • 
                          {result?.results?.length || 0} students
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => downloadResult(result?._id)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleResultDetails(result?._id)}
                          className="text-gray-600 hover:text-gray-900 p-1.5 hover:bg-gray-50 rounded"
                          title={expandedResult === result?._id ? "Hide details" : "Show details"}
                        >
                          {expandedResult === result?._id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedResult === result?._id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 text-sm mb-2">Subjects:</h4>
                          <div className="flex flex-wrap gap-2">
                            {result?.subjects?.map((subj, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                {subj?.name || 'Subject'} ({subj?.maxMarks || 0})
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700 text-sm">Student Results:</h4>
                          <div className="max-h-64 overflow-y-auto">
                            {result?.results?.map((res, index) => {
                              const totalMarks = res?.marksObtained?.reduce((sum, mark) => sum + (mark || 0), 0) || 0;
                              const maxTotal = result?.subjects?.reduce((sum, subj) => sum + (parseInt(subj?.maxMarks) || 0), 0) || 0;
                              const percentage = maxTotal > 0 ? ((totalMarks / maxTotal) * 100).toFixed(1) : 0;
                              
                              return (
                                <div key={index} className="bg-gray-50 rounded p-2 text-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium">{res?.studentId?.name || 'Student'}</span>
                                    <div className="text-right">
                                      <div>{totalMarks}/{maxTotal}</div>
                                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                                        percentage >= 75 ? 'bg-green-100 text-green-800' :
                                        percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {percentage}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-gray-600">
                                    Roll: {res?.studentId?.rollNo || 'N/A'}
                                    {res?.teacherRemarks && (
                                      <div className="mt-1 italic">"{res.teacherRemarks}"</div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">
                    {Array.isArray(uploadedResults) && uploadedResults.length === 0 
                      ? "No results uploaded yet" 
                      : "No results match your filters"}
                  </p>
                </div>
              )}
            </div>

            {/* Results Table - Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("examDate")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortConfig.key === "examDate" && 
                          (sortConfig.direction === "asc" ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )
                        }
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("classId.name")}
                    >
                      <div className="flex items-center gap-1">
                        Class
                        {sortConfig.key === "classId.name" && 
                          (sortConfig.direction === "asc" ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )
                        }
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("examType")}
                    >
                      <div className="flex items-center gap-1">
                        Exam Type
                        {sortConfig.key === "examType" && 
                          (sortConfig.direction === "asc" ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )
                        }
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredResults) && filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <React.Fragment key={result?._id}>
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleResultDetails(result?._id)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result?.examDate ? new Date(result.examDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result?.classId?.name || 'Class'} - {result?.classId?.section || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{result?.examType || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result?.results?.length || 0} students
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadResult(result?._id);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              title="Download PDF"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleResultDetails(result?._id);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                              title={expandedResult === result?._id ? "Hide details" : "Show details"}
                            >
                              {expandedResult === result?._id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedResult === result?._id && (
                          <tr className="bg-blue-50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  Result Details: {result?.examType || 'Exam'} - 
                                  {result?.examDate ? new Date(result.examDate).toLocaleDateString() : 'No date'}
                                </h3>
                                
                                <div className="mb-4">
                                  <h4 className="font-medium text-gray-700">Subjects:</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {result?.subjects?.map((subj, idx) => (
                                      <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                        {subj?.name || 'Subject'} (Max: {subj?.maxMarks || 0})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student</th>
                                        {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Roll No</th> */}
                                        {result?.subjects?.map((subj, idx) => (
                                          <th key={idx} className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                                            {subj?.name || 'Subject'}
                                          </th>
                                        ))}
                                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Total</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Remarks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {result?.results?.map((res, index) => {
                                        const totalMarks = res?.marksObtained?.reduce((sum, mark) => sum + (mark || 0), 0) || 0;
                                        const maxTotal = result?.subjects?.reduce((sum, subj) => sum + (parseInt(subj?.maxMarks) || 0), 0) || 0;
                                        const percentage = maxTotal > 0 ? ((totalMarks / maxTotal) * 100).toFixed(1) : 0;
                                        
                                        return (
                                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                              {res?.studentId?.name || 'Student'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                              {res?.studentId?.rollNo || 'N/A'}
                                            </td>
                                            {res?.marksObtained?.map((mark, idx) => (
                                              <td key={idx} className="px-4 py-3 text-sm text-center text-gray-500">
                                                {mark}
                                              </td>
                                            ))}
                                            <td className="px-4 py-3 text-center">
                                              <div className="text-sm font-semibold">{totalMarks}/{maxTotal}</div>
                                              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                                percentage >= 75 ? 'bg-green-100 text-green-800' :
                                                percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                              }`}>
                                                {percentage}%
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                              {res?.teacherRemarks || 'No remarks'}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        {Array.isArray(uploadedResults) && uploadedResults.length === 0 
                          ? "No results uploaded yet" 
                          : "No results match your filters"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {Array.isArray(filteredResults) && filteredResults.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredResults.length} of {uploadedResults.length} results
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;