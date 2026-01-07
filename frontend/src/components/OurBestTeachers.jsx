import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

const OurBestTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teacher/get-teacher');
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        // Fallback to dummy data if API fails
        setTeachers([
          {
            id: 1,
            name: "Steven Strange",
            title: "Teacher",
            image: "/api/placeholder/220/280",
            hasImage: true
          },
          {
            id: 2,
            name: "Diana Prince",
            title: "Teacher",
            image: "/api/placeholder/220/280",
            hasImage: true
          }
        ]);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 py-16 px-6 font-sans text-center">
        Loading teachers...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching teachers:", error);
  }

  return (
    <div className="bg-gray-100 py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Best Teachers
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Our caring and experienced teachers make learning fun, nurturing every child with love, patience, and joy.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="text-center">
              {/* Teacher Image/Card */}
              <div className="relative mb-6">
                {teacher.hasImage ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80 w-full">
                    {teacher.image ? (
                      <img 
                        src={teacher.image} 
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                          <div className="w-16 h-16 mx-auto mb-3 bg-slate-400 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">Teacher Photo</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg h-80 w-full flex flex-col items-center justify-center relative">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {teacher.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {teacher.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Teacher Name and Title */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {teacher.name}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {teacher.title}
                </p>
                {/* {teacher.qualifications && (
                  <p className="text-gray-500 text-xs mt-1">
                    {teacher.qualifications}
                  </p>
                )} */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurBestTeachers;