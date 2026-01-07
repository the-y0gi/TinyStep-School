import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Page imports
import Home from "../pages/HomePage.jsx";
import About from "../pages/About.jsx";
import Staff from "../pages/Staff.jsx";
import Gallery from "../pages/Gallery.jsx";
import AdmissionDetails from "../pages/AdmissionDetails.jsx";
import Contact from "../pages/Contact.jsx";
import AdmissionForm from "../pages/RegistrationPage.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
import FeeManagementPage from "../pages/FeeManagementPage.jsx";
import StudentReportCard from "../pages/StudentReportCard.jsx";
import KidsAttendanceTracker from "../pages/TrackPage.jsx";
import Login from "../pages/Login.jsx";

// Super Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminStudents from "../pages/admin/AdminStudents.jsx";
import AdminTeachers from "../pages/admin/AdminTeachers.jsx";
import AdminClasses from "../pages/admin/AdminClasses.jsx";
import AdminFees from "../pages/admin/AdminFees.jsx";
import AdminNotifications from "../pages/admin/AdminNotifications.jsx";
import AdminSettings from "../pages/admin/AdminSettings.jsx";

import TeacherLayout from "../layouts/TeacherLayout.jsx";
import TeacherDashboard from "../pages/teacher/TeacherDashboard.jsx";
import TeacherAttendance from "../pages/teacher/Attendance.jsx";
import Notification from "../pages/teacher/Notification.jsx";
import TeacherResults from "../pages/teacher/Results.jsx";
import TeacherRankings from "../pages/teacher/Rankings.jsx";
import TeacherProfile from "../pages/teacher/Profile.jsx";

// Layouts
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";

import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TeacherLogin from "../pages/teacher/TeacherLogin.jsx";

import { Toaster } from "react-hot-toast";
import Signup from "../pages/SignUp.jsx";
import ForgotPassword from "../pages/ForgetPassword.jsx";
import PendingApprovalPage from "../pages/PendingApprovalPage.jsx";
import StudentDetails from "../pages/admin/StudentDetails.jsx";

const AppRoutes = () => {
  const location = useLocation();

  const isProtectedRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/teacher") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/forget-password");

  return (
    <>
      {!isProtectedRoute && <Navbar />}
      <Toaster position="top-right" />
      <div className={!isProtectedRoute ? "mt-10" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admission-detail" element={<AdmissionDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/registration-form" element={<AdmissionForm />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/fee-management" element={<FeeManagementPage />} />
          <Route path="/student-result" element={<StudentReportCard />} />
          <Route path="/track-card" element={<KidsAttendanceTracker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Teacher Login */}
          <Route path="/teacher/login" element={<TeacherLogin />} />

          {/* Teacher Panel (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route
                path="/teacher/attendance"
                element={<TeacherAttendance />}
              />
              <Route path="/teacher/notification" element={<Notification />} />
              <Route path="/teacher/results" element={<TeacherResults />} />
              <Route path="/teacher/rankings" element={<TeacherRankings />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
            </Route>
          </Route>

          {/* Super Admin Panel (Protected) */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/students/:id" element={<StudentDetails />} />
              <Route path="/admin/teachers" element={<AdminTeachers />} />
              <Route path="/admin/classes" element={<AdminClasses />} />
              <Route path="/admin/fees" element={<AdminFees />} />
              <Route
                path="/admin/notifications"
                element={<AdminNotifications />}
              />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="p-4 text-red-600">404 - Page Not Found</div>
            }
          />
        </Routes>
      </div>
      {!isProtectedRoute && <Footer />}
    </>
  );
};

export default AppRoutes;
