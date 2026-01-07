import { useState, useEffect, useRef } from "react";
import { Menu, Phone, User, X, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import { toast } from "react-toastify";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Check login status on mount and route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleUserIconClick = async () => {
    setMobileMenuOpen(false);
    setShowLoginPopup(false);
    
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axiosInstance.get("/student/parent/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data.success) throw new Error(data.message);

        if (!data.hasRegisteredKid) {
          navigate("/registration-form");
        } else if (!data.isApproved) {
          navigate("/pending-approval");
        } else {
          navigate(`/student-dashboard`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to check status");
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    setShowLoginPopup(false);
    navigate("/login");
  };

  const handleRegister = () => {
    setShowLoginPopup(false);
    navigate("/signup");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Staff", path: "/staff" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <>
      <nav ref={navRef} className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("/")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-white font-bold text-lg">TS</div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                  Tinysteps
                </span>
                <span className="text-xs text-gray-500 -mt-1">School</span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ name, path }) => (
                <button
                  key={path}
                  onClick={() => handleNavClick(path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    location.pathname === path
                      ? "bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg transform hover:scale-105"
                      : "text-gray-600 hover:text-gray-800 relative group"
                  }`}
                >
                  {name}
                  {location.pathname !== path && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Contact Info & User Icon (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="tel:0603339999"
                className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50 hover:bg-orange-50/50 hover:border-orange-300/50 hover:text-orange-600 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-medium">060 333 9999</span>
              </a>

              <button
                onClick={handleUserIconClick}
                className="p-2 rounded-full bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-100/70 transition-all duration-200 hover:scale-105 group cursor-pointer"
              >
                <User className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors duration-200" />
              </button>

              {/* Logout Button - Desktop */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-red-50/50 backdrop-blur-sm border border-red-200/50 hover:bg-red-100/70 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105 group cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg border-t border-white/20 px-4 py-3 space-y-3">
            {navItems.map(({ name, path }) => (
              <button
                key={path}
                onClick={() => handleNavClick(path)}
                className={`block w-full text-left font-medium py-2 px-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  location.pathname === path
                    ? "text-orange-500 bg-orange-50/50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
              >
                {name}
              </button>
            ))}

            {/* Contact & User Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 mt-2 px-3">
              <a
                href="tel:0603339999"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-medium">060 333 9999</span>
              </a>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUserIconClick}
                  className="p-2 rounded-full bg-gray-50/50 hover:bg-gray-100/70 transition-all duration-200 group cursor-pointer"
                >
                  <User className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors duration-200" />
                </button>

                {/* Logout Button - Mobile */}
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-red-50/50 hover:bg-red-100/70 transition-all duration-200 group cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login/Register Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="p-1 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 mb-6">
                  Join Tinysteps School community to access exclusive features
                  and stay connected!
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>

                <button
                  onClick={handleRegister}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;