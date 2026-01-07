import axiosInstance from "./axiosConfig";

// Dashboard APIs
export const fetchDashboardStats = () => {
  return axiosInstance.get("/admin/dashboard/stats");
};

export const fetchRecentActivity = () => {
  return axiosInstance.get("/admin/dashboard/activity");
};

// Quick Action APIs (add these too)
export const bulkApproveStudents = (studentIds) => {
  return axiosInstance.post("/admin/students/bulk-approve", { studentIds });
};

export const createNewClass = (classData) => {
  return axiosInstance.post("/admin/classes", classData);
};

export const sendNotification = (notificationData) => {
  return axiosInstance.post("/admin/notifications", notificationData);
};

// services/adminAllAPIs.js
export const getStudents = (status = "pending") => {
  return axiosInstance.get(`/admin/students?status=${status}`);
};

export const approveStudent = (studentId) => {
  return axiosInstance.post(`/admin/students/approve/${studentId}`);
};

export const rejectStudents = (studentIds) => {
  return axiosInstance.post("/admin/students/reject", { studentIds });
};

export const getStudentDetails = (studentId) => {
  return axiosInstance.get(`/admin/students/details/${studentId}`);
};

// Teacher Management APIs
export const teacherAPI = {
  // Get all teachers
  getAllTeachers: () => axiosInstance.get("/admin/teachers"),

  // Create new teacher
  createTeacher: (teacherData) =>
    axiosInstance.post("/admin/teachers", teacherData),

  // Assign class to teacher
  assignClassToTeacher: (teacherId, classId) =>
    axiosInstance.post(`/admin/teachers/${teacherId}/assign-class`, {
      classId,
    }),

  // (Optional) Delete teacher
  deleteTeacher: (teacherId) =>
    axiosInstance.delete(`/admin/teachers/${teacherId}`),
};

// Class Management APIs
export const classAPI = {
  // Get all classes
  getAllClasses: () => axiosInstance.get("/admin/classes"),

  getClassDetails: (classId) =>
    axiosInstance.get(`/admin/classes-details/${classId}`),
  // Create new class
  createClass: (classData) =>
    axiosInstance.post("/admin/classes/create", classData),

  // Add students to class
  addStudentsToClass: (classId, studentIds) =>
    axiosInstance.post(`/admin/classes/${classId}/students`, { studentIds }),

  // (Optional) Delete class
  deleteClass: (classId) => axiosInstance.delete(`/admin/classes/${classId}`),
};

export const getAllStudents = (status = "pending") => {
  return axiosInstance.get(`/admin/students`);
};

// Fee Management APIs
export const feeAPI = {
  // Get all fee records
  getAllFees: () => axiosInstance.get("/fees"),

  // Get overdue fees
  getOverdueFees: () => axiosInstance.get("/fees/overdue"),

  // Send reminder for a fee
  sendReminder: (feeId) => axiosInstance.post(`/fees/reminder`, { feeId }),

  // (Optional) Create new fee record
  createFee: (feeData) => axiosInstance.post("/fees", feeData),
};

// Dashboard API methods
export const dashboardApi = {
  getDashboardData: (studentId) => axiosInstance.get(`/dashboard/${studentId}`),
  getFeeDetails: (studentId) =>
    axiosInstance.get(`/dashboard/${studentId}/fees`),
  getAttendanceDetails: (studentId, year) =>
    axiosInstance.get(`/dashboard/${studentId}/attendance`, {
      params: { year },
    }),
  getResultDetails: (studentId) =>
    axiosInstance.get(`/dashboard/${studentId}/results`),
  getStudentDocuments: (studentId) =>
    axiosInstance.get(`/dashboard/${studentId}/documents`),
};

export const getStudentProfile = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/dashboard/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching student:",
      error.response?.data?.error || error.message
    );
    throw error;
  }
};
