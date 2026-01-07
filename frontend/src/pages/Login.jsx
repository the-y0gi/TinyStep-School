import React, { useState } from "react";
import { Eye, EyeOff, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!password.trim()) {
      alert('Please enter your password');
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/auth/user-login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { token, user } = res.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate after successful login
      navigate('/'); // You can redirect based on user.role if needed

    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || 'Login failed';
      alert(message);
    }
  };

 

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
    // window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen relative bg-gray-100">
      <style jsx>{`
        .mobile-text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        .mobile-text-shadow-light {
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
        }
        .mobile-text-shadow-small {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        @media (min-width: 1024px) {
          .mobile-text-shadow,
          .mobile-text-shadow-light,
          .mobile-text-shadow-small {
            text-shadow: none;
          }
        }
      `}</style>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1663110026932-0725b0bcd44e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
          </div>
          <span className="text-lg font-bold text-gray-800 ml-2 tracking-wide">
            TINYSTEPS
          </span>
        </div>
        <button className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-3 lg:p-4">
        <div className="flex w-full max-w-6xl">
          {/* Left side - Logo and spacing (desktop only) */}
          <div className="hidden lg:flex lg:w-1/2 items-start justify-start p-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
              </div>
              <span className="text-2xl font-bold text-white ml-2 tracking-wide drop-shadow-lg">
                TINYSTEPS
              </span>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-sm lg:max-w-md bg-transparent lg:bg-white/95 lg:backdrop-blur-sm lg:rounded-2xl lg:shadow-2xl p-4 lg:p-8">
              {/* Form Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2 lg:mb-3 mobile-text-shadow">
                  Welcome back
                </h1>
                <p className="text-white lg:text-gray-600 text-xs lg:text-sm leading-relaxed mobile-text-shadow-light">
                  Continue your child's
                  <br />
                  amazing learning adventure.
                </p>
              </div>

              {/* Login Form */}
              <div className="space-y-4 lg:space-y-5">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email or phone number"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white text-gray-900 font-medium"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 pr-10 lg:pr-12 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white text-gray-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="lg:w-5 lg:h-5" />
                    ) : (
                      <Eye size={16} className="lg:w-5 lg:h-5" />
                    )}
                  </button>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-3 lg:w-4 h-3 lg:h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs lg:text-sm text-white lg:text-gray-600 mobile-text-shadow-small">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 text-xs lg:text-sm font-medium mobile-text-shadow-small"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <div className="mt-6 lg:mt-8">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 lg:py-3.5 px-4 rounded-lg transition-colors shadow-sm text-sm lg:text-base"
                  >
                    Log In
                  </button>
                </div>

                {/* Signup link */}
                <div className="text-center mt-6 lg:mt-8">
                  <span className="text-white lg:text-gray-600 text-xs lg:text-sm mobile-text-shadow-small">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={handleSignupRedirect}
                      className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 font-semibold underline"
                    >
                      Sign Up
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circles - bottom right */}
      <div className="absolute bottom-8 right-8 w-32 lg:w-48 h-32 lg:h-48 opacity-10">
        <div className="absolute inset-0 border-2 lg:border-4 border-white rounded-full"></div>
        <div className="absolute inset-4 lg:inset-6 border lg:border-2 border-white rounded-full"></div>
        <div className="absolute inset-8 lg:inset-12 border border-white rounded-full"></div>
      </div>
    </div>
  );
}
