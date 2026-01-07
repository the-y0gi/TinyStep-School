import React from "react";
import { useNavigate } from "react-router-dom";

export default function KindergartenWelcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50  flex items-center justify-center mt-18">
      <div className="max-w-7xl w-full bg-white rounded-lg border-2 md:border-4 border-blue-400 p-6 md:p-12 relative overflow-hidden">
        {/* Background decorative shapes */}
        <div className="absolute top-16 right-16 w-20 h-16 bg-orange-200 rounded-full opacity-60"></div>
        <div className="absolute top-32 right-32 w-6 h-6 bg-orange-400 rounded-full"></div>
        <div className="absolute top-48 right-24 w-4 h-4 bg-cyan-400 rounded-sm rotate-45"></div>
        <div className="absolute bottom-24 right-40 w-16 h-12 bg-cyan-200 rounded-full opacity-70"></div>
        <div className="absolute bottom-16 right-16 w-24 h-20 bg-orange-100 rounded-full opacity-50"></div>
        <div className="absolute top-40 right-52 w-3 h-3 bg-yellow-400 rounded-full"></div>

        {/* Curved decorative lines */}
        <svg
          className="absolute top-24 right-48 w-16 h-8 opacity-60"
          viewBox="0 0 64 32"
        >
          <path
            d="M8 16 Q 32 8, 56 16"
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700 leading-tight">
              Welcome To Our Kindergarten
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              A leading kinder garden school dedicated to providing a nurturing
              and stimulating environment for young learners. With a commitment
              to excellence in early education, we believe in shaping curious
              minds and building a strong foundation for a lifelong love of
              learning. Our holistic approach fosters intellectual, social,
              emotional, and physical development, ensuring that each child
              reaches their full potential.
            </p>

            <button
              onClick={() => navigate("/admission-detail")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg transition-colors duration-200 shadow-lg w-full sm:w-auto"
            >
              ADMISSION DETAILS
            </button>
          </div>

          {/* Right Content - Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative">
              {/* Main image container with rounded border */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Children playing and learning in kindergarten"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements around the image */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyan-300 rounded-full opacity-70"></div>
              <div className="absolute top-12 -right-6 w-6 h-6 bg-orange-300 rounded-full"></div>
              <div className="absolute bottom-16 -left-8 w-10 h-6 bg-cyan-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 right-12 w-12 h-12 bg-orange-200 rounded-full opacity-50"></div>

              {/* Small triangle decoration */}
              <div className="absolute top-20 left-8 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-cyan-400 opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
