import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  FileText,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      path: "/teacher/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Attendance",
      path: "/teacher/attendance",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      label: "Notification",
      path: "/teacher/notification",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: "Result Entry",
      path: "/teacher/results",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Rankings",
      path: "/teacher/rankings",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      label: "Profile",
      path: "/teacher/profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.clear();
      alert("Logged out successfully!");
      window.location.href = "/login";
    }
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
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg"
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
        fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200
        shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Teacher Panel</h2>
              <p className="text-xs text-gray-500">Education Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 overflow-y-auto pb-20">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-300 rounded-r-full" />
                  )}
                  <span
                    className={`flex items-center transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section - At Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 
                     hover:bg-red-50 hover:text-red-500 transition-all duration-200 
                     group border border-transparent hover:border-red-200"
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
      <div className="hidden lg:block w-60 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
