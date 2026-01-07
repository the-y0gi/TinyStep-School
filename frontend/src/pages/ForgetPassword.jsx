import React, { useState, useRef, useEffect } from "react";
import { Menu, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosConfig";

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (currentStep === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/send-reset-otp', { email });
      toast.success(response.data.message || "OTP sent successfully");
      setCurrentStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-reset-otp', { email, otp: otpString });
      toast.success(response.data.message || "OTP verified successfully");
      setCurrentStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/send-reset-otp', { email });
      toast.success(response.data.message || "OTP resent successfully");
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleSetNewPassword = async () => {
    if (!newPassword.trim()) {
      toast.error("Please enter new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        email,
        newPassword,
        confirmPassword
      });
      toast.success(response.data.message || "Password reset successful");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setOtp(["", "", "", "", "", ""]);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setNewPassword("");
      setConfirmPassword("");
    }
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
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={currentStep === 1 ? handleBackToLogin : handleBackStep}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
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
        </div>
        <button className="p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-3 lg:p-4">
        <div className="flex w-full max-w-6xl">
          {/* Left side - Logo (desktop only) */}
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
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <>
                  <div className="mb-6 lg:mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2 lg:mb-3 mobile-text-shadow">
                      Forgot password?
                    </h1>
                    <p className="text-white lg:text-gray-600 text-xs lg:text-sm leading-relaxed mobile-text-shadow-light">
                      No worries! Enter your email and we'll
                      <br />
                      send you a verification code.
                    </p>
                  </div>

                  <div className="space-y-4 lg:space-y-5">
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white text-gray-900 font-medium"
                      />
                    </div>

                    <div className="mt-6 lg:mt-8">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-2 lg:py-3.5 px-4 rounded-lg transition-colors shadow-sm text-sm lg:text-base flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending code...
                          </>
                        ) : (
                          "Send verification code"
                        )}
                      </button>
                    </div>

                    <div className="text-center mt-6 lg:mt-8">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-white lg:text-gray-600 text-xs lg:text-sm mobile-text-shadow-small hover:text-orange-300 lg:hover:text-orange-500 transition-colors"
                      >
                        ← Back to login
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <>
                  <div className="mb-6 lg:mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2 lg:mb-3 mobile-text-shadow">
                      Enter verification code
                    </h1>
                    <p className="text-white lg:text-gray-600 text-xs lg:text-sm leading-relaxed mobile-text-shadow-light">
                      We've sent a 6-digit code to
                      <br />
                      <span className="font-semibold text-orange-300 lg:text-orange-600">
                        {email}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    {/* OTP Input Fields */}
                    <div className="flex justify-center gap-2 lg:gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-10 lg:w-12 lg:h-12 text-center text-lg lg:text-xl font-bold border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900 transition-all"
                        />
                      ))}
                    </div>

                    {/* Resend Code */}
                    <div className="text-center">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="text-orange-300 lg:text-orange-500 hover:text-orange-400 lg:hover:text-orange-600 text-xs lg:text-sm font-medium underline mobile-text-shadow-small disabled:opacity-50"
                        >
                          {isLoading ? "Resending..." : "Resend code"}
                        </button>
                      ) : (
                        <p className="text-white lg:text-gray-500 text-xs lg:text-sm mobile-text-shadow-small">
                          Resend code in {timer}s
                        </p>
                      )}
                    </div>

                    {/* Verify Button */}
                    <div className="mt-6 lg:mt-8">
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.join("").length !== 6}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 lg:py-3.5 px-4 rounded-lg transition-colors shadow-sm text-sm lg:text-base flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : (
                          "Verify code"
                        )}
                      </button>
                    </div>

                    {/* Change Email */}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="text-white lg:text-gray-600 text-xs lg:text-sm mobile-text-shadow-small hover:text-orange-300 lg:hover:text-orange-500 transition-colors"
                      >
                        ← Use different email
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: New Password */}
              {currentStep === 3 && (
                <>
                  <div className="mb-6 lg:mb-8">
                    <h1 className="text-xl lg:text-3xl font-bold text-white lg:text-gray-900 mb-2 lg:mb-3 mobile-text-shadow">
                      Set new password
                    </h1>
                    <p className="text-white lg:text-gray-600 text-xs lg:text-sm leading-relaxed mobile-text-shadow-light">
                      Create a strong password for
                      <br />
                      your account security.
                    </p>
                  </div>

                  <div className="space-y-4 lg:space-y-5">
                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 pr-10 lg:pr-12 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white text-gray-900 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} className="lg:w-5 lg:h-5" />
                        ) : (
                          <Eye size={16} className="lg:w-5 lg:h-5" />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 lg:px-4 py-2 lg:py-3 pr-10 lg:pr-12 border border-white/50 lg:border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xs lg:text-sm placeholder-gray-600 lg:placeholder-gray-500 bg-white text-gray-900 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="lg:w-5 lg:h-5" />
                        ) : (
                          <Eye size={16} className="lg:w-5 lg:h-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="text-xs lg:text-sm text-white lg:text-gray-500 mobile-text-shadow-small">
                      Password must be at least 6 characters long
                    </div>

                    {/* Update Password Button */}
                    <div className="mt-6 lg:mt-8">
                      <button
                        type="button"
                        onClick={handleSetNewPassword}
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold py-2 lg:py-3.5 px-4 rounded-lg transition-colors shadow-sm text-sm lg:text-base flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating password...
                          </>
                        ) : (
                          "Update password"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
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