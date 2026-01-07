import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

export default function TinyStepsSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTriggered, setOtpTriggered] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const isReadyForOtp =
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword;

    if (isReadyForOtp && !otpTriggered) {
      sendOtp();
    } else if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [formData]);

  const sendOtp = async () => {
    try {
      const { email } = formData;
      setOtpTriggered(true); // Set this first to prevent multiple calls
      await axiosInstance.post("/auth/send-otp", { email });
      setShowOtpField(true);
      setOtpSent(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP. Try again.");
      setShowOtpField(false);
      setOtpTriggered(false); // Reset if failed
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showOtpField || !formData.otp.trim()) {
      alert("Please enter the OTP to proceed");
      return;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to terms and conditions");
      return;
    }

    try {
      // First verify OTP with backend
      await axiosInstance.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      // Then proceed to signup with all required fields
      const { data } = await axiosInstance.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "parent", // Required field
        personalInfo: {
          name: `${formData.firstName} ${formData.lastName}`, // Combine first and last name
          phone: formData.phone, // Add empty string if phone is required but not collected
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });

      localStorage.setItem("token", data.token);
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Signup failed. Please check all required fields."
      );
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
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
                  Create account
                </h1>
                <p className="text-white lg:text-gray-600 text-xs lg:text-sm leading-relaxed mobile-text-shadow-light">
                  Stay connected with
                  <br />
                  your child's joyful learning journey.
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                {/* First row - First name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email or phone number"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                />
                {/* Second row - Last name and Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 pr-8 lg:pr-12 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff size={14} className="lg:w-5 lg:h-5" />
                      ) : (
                        <Eye size={14} className="lg:w-5 lg:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Third row - Confirm Password (and OTP when shown) */}

                <div
                  className={`grid gap-3 lg:gap-4 ${
                    showOtpField ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 pr-8 lg:pr-12 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} className="lg:w-5 lg:h-5" />
                      ) : (
                        <Eye size={16} className="lg:w-5 lg:h-5" />
                      )}
                    </button>
                    {passwordError && (
                      <div className="absolute -bottom-5 left-0 text-xs text-red-500">
                        {passwordError}
                      </div>
                    )}
                  </div>

                  {/* OTP field - only shown when all other fields are filled */}
                  {showOtpField && (
                    <div className="relative">
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white lg:bg-white text-gray-900 font-medium animate-pulse"
                      />
                      {otpSent && (
                        <div className="absolute -bottom-5 left-0 text-xs text-green-300 lg:text-green-600 font-medium">
                          OTP sent to your email!
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Remember me and Forgot password */}
                <div className="flex items-center justify-between mt-4 lg:mt-6">
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

                {/* Terms agreement */}
                <div className="mt-3 lg:mt-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="w-3 lg:w-4 h-3 lg:h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-xs lg:text-sm text-white lg:text-gray-600 leading-relaxed mobile-text-shadow-small">
                      I agree to all the{" "}
                      <a
                        href="#"
                        className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 underline font-medium"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 underline font-medium"
                      >
                        Privacy policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <div className="mt-5 lg:mt-8">
                  <button
                    type="submit"
                    disabled={
                      !showOtpField ||
                      !formData.otp.trim() ||
                      !formData.agreeTerms
                    }
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 lg:py-3.5 px-4 rounded-lg transition-colors shadow-sm text-sm lg:text-base"
                  >
                    {!showOtpField
                      ? "Fill all fields to continue"
                      : "Create account"}
                  </button>
                </div>

                {/* Login link */}
                <div className="text-center mt-4 lg:mt-6">
                  <span className="text-white lg:text-gray-600 text-xs lg:text-sm mobile-text-shadow-small">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={handleLoginRedirect}
                      className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 font-semibold underline"
                    >
                      Log In
                    </button>
                  </span>
                </div>
              </form>
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
