import React, { useState, useEffect, useRef } from "react";

const TinystepsWelcome = () => {
  const [counters, setCounters] = useState({
    years: 0,
    courses: 0,
    students: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  const animateCounter = (key, targetValue, suffix = "", duration = 2000) => {
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }

      setCounters((prev) => ({
        ...prev,
        [key]: currentValue,
      }));
    }, 16);
  };

  const startAnimation = () => {
    if (!hasAnimated) {
      setHasAnimated(true);
      setTimeout(() => {
        animateCounter("years", 10, "+", 2000);
        animateCounter("courses", 10, "+", 2200);
        animateCounter("students", 1000, "K+", 2500);
      }, 300);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    // Also start animation on component mount
    const timer = setTimeout(startAnimation, 500);

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
      clearTimeout(timer);
    };
  }, [hasAnimated]);

  const formatNumber = (value, key) => {
    if (key === "students") {
      return (Math.floor(value / 100) / 10).toFixed(1) + "K+";
    }
    return Math.floor(value) + "+";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-5 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center p-8 lg:p-16 gap-12">
          {/* Welcome Section */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-sky-500 leading-tight tracking-tight">
              Welcome to{" "}
              <span className="text-sky-600 font-black">Tinysteps</span>
            </h1>
            <p className="text-slate-700 text-lg font-semibold leading-relaxed tracking-wide">
              Rooted in Care, Rising in Knowledge
            </p>
          </div>

          {/* Image Section */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Orange Background Container */}
              {/* <div className="w-80 h-96 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-full rounded-b-3xl shadow-2xl flex items-end justify-center overflow-hidden">
           
                <div className="w-72 h-80 bg-gradient-to-t from-slate-100 to-white rounded-t-2xl flex flex-col items-center justify-center relative">
                  
            
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50 rounded-t-2xl border-2 border-dashed border-slate-300">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p>Add your image here</p>
                      <p className="text-xs text-slate-300 mt-1">280x320 recommended</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 flex flex-col gap-1">
                    <div className="w-20 h-3 bg-red-500 rounded-sm shadow-sm"></div>
                    <div className="w-20 h-3 bg-blue-500 rounded-sm shadow-sm"></div>
                    <div className="w-20 h-3 bg-green-500 rounded-sm shadow-sm"></div>
                    <div className="w-20 h-3 bg-yellow-500 rounded-sm shadow-sm"></div>
                  </div>
                </div>
              </div> */}
              <div className="w-80 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-full rounded-b-3xl shadow-2xl flex items-end justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605644522491-77f2f13c6ea9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // <-- yahan apni image ka path daal
                  alt="Your Image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full shadow-lg animate-pulse"></div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-sky-500 mb-4 tracking-tight">
                Our <span className="text-sky-600 font-black">Mission</span>
              </h2>
              <p className="text-slate-700 text-base leading-relaxed font-medium tracking-wide">
                To nurture young minds through a safe, joyful, and engaging
                environment that inspires a lifelong love of learning.
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex justify-between gap-6">
              <div className="text-center flex-1">
                <span className="block text-3xl lg:text-4xl font-black text-sky-500 mb-2 tracking-tight">
                  {formatNumber(counters.years, "years")}
                </span>
                <div className="text-slate-600 text-sm leading-tight font-semibold tracking-wide">
                  Years
                  <br />
                  Experience
                </div>
              </div>

              <div className="text-center flex-1">
                <span className="block text-3xl lg:text-4xl font-black text-sky-500 mb-2 tracking-tight">
                  {formatNumber(counters.courses, "courses")}
                </span>
                <div className="text-slate-600 text-sm leading-tight font-semibold tracking-wide">
                  Total
                  <br />
                  Course
                </div>
              </div>

              <div className="text-center flex-1">
                <span className="block text-3xl lg:text-4xl font-black text-sky-500 mb-2 tracking-tight">
                  {formatNumber(counters.students, "students")}
                </span>
                <div className="text-slate-600 text-sm leading-tight font-semibold tracking-wide">
                  Student
                  <br />
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinystepsWelcome;
