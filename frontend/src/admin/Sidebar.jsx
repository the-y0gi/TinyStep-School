import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  School,
} from "lucide-react";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/dashboard",
    },
    {
      name: "Students",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/students",
    },
    {
      name: "Teachers",
      icon: <GraduationCap className="w-5 h-5" />,
      path: "/admin/teachers",
    },
    {
      name: "Classes",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/admin/classes",
    },
    {
      name: "Fee Management",
      icon: <IndianRupee className="w-5 h-5" />,
      path: "/admin/fees",
    },
    {
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/admin/notifications",
    },
  ];

  const handleLogout = () => {
    
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    sessionStorage.clear();

    // Show success message
    alert("Logged out successfully!");

    // Redirect to login page
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0  bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-800 
        text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">School Admin</h2>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 overflow-y-auto pb-20">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg transform scale-[1.02]"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-r-full" />
                  )}
                  <span
                    className={`flex items-center transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section - At Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 
                     hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 
                     group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium">Logout</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
