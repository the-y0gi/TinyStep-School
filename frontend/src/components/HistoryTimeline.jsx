import React, { useState } from 'react';

export default function HistoryTimeline() {
  const [activeYear, setActiveYear] = useState('2023');
  
  const timelineData = [
    {
      year: '2023',
      title: 'Resilience and Future Horizons',
      description: 'Adapting to new challenges, we remained committed to our mission of providing an exceptional early education. Looking ahead with optimism, we envision a future filled with boundless possibilities as we continue shaping the leaders and thinkers of tomorrow.'
    },
    {
      year: '2017',
      title: 'Innovation and Technology',
      description: 'Innovation became the driving force behind our kindergarten\'s progress from 2016 to 2020. Embracing the latest educational technologies, we crafted engaging and interactive learning experiences for our students.'
    },
    {
      year: '2012',
      title: 'Expansion and Recognition',
      description: 'These years marked a period of expansion and recognition for our school. As we extended our facilities and enhanced our curriculum, we received accolades for our commitment to quality education and innovative teaching methodologies.'
    },
    {
      year: '2005',
      title: 'Inception and Growth',
      description: 'Established in 2005, our kindergarten school began its journey with a vision to provide a nurturing space for young minds to explore, learn, and grow. Over the next few years, we witnessed significant growth.'
    }
  ];

  const currentData = timelineData.find(item => item.year === activeYear);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-6 md:space-y-8 mb-16">
          <div className="inline-block">
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
              Our Progressive Journey
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight">
            Our History
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Founded with a passion for early education in 2005, our kindergarten school boasts a rich history of empowering young learners to reach their potential through innovative teaching methods and a supportive learning environment.
          </p>
        </div>

        {/* Mobile View - Interactive Timeline */}
        <div className="block lg:hidden">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            
            {/* Timeline Navigation Bar */}
            <div className="relative mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-out"
                style={{ width: `${((timelineData.findIndex(item => item.year === activeYear) + 1) / timelineData.length) * 100}%` }}
              ></div>
              
              <div className="relative flex justify-between items-center">
                {timelineData.map((item) => (
                  <button
                    key={item.year}
                    onClick={() => setActiveYear(item.year)}
                    className={`group relative flex flex-col items-center transition-all duration-300 ${
                      activeYear === item.year ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full border-4 transition-all duration-300 ${
                        activeYear === item.year 
                          ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-200' 
                          : 'bg-white border-gray-300 group-hover:border-orange-300'
                      }`}
                    ></div>
                    
                    <div className={`mt-3 transition-all duration-300 ${
                      activeYear === item.year ? 'transform -translate-y-1' : ''
                    }`}>
                      <span 
                        className={`text-lg font-bold transition-colors duration-300 ${
                          activeYear === item.year 
                            ? 'text-orange-500' 
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>
                    
                    {activeYear === item.year && (
                      <div className="absolute -top-2 w-6 h-6 rounded-full bg-orange-100 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="transition-all duration-500 ease-out">
              {currentData && (
                <div className="text-center space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-orange-400 rounded-sm animate-pulse"></div>
                      ))}
                    </div>
                    <span className="text-4xl font-bold text-gray-800">
                      {currentData.year}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-800 leading-tight">
                    {currentData.title}
                  </h2>
                  
                  <p className="text-gray-600 text-base leading-relaxed">
                    {currentData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop View - Modern Timeline Layout */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            
            {/* Top Navigation Bar */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-8 py-6 border-b border-orange-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Our Journey</h3>
                <div className="flex space-x-2">
                  {timelineData.map((item) => (
                    <button
                      key={item.year}
                      onClick={() => setActiveYear(item.year)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        activeYear === item.year 
                          ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                          : 'bg-white text-gray-600 hover:bg-orange-200 hover:text-orange-700'
                      }`}
                    >
                      {item.year}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((timelineData.findIndex(item => item.year === activeYear) + 1) / timelineData.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-12">
              {currentData && (
                <div className="animate-slideIn">
                  <div className="grid grid-cols-12 gap-8 items-center">
                    
                    {/* Left - Year Display */}
                    <div className="col-span-4">
                      <div className="text-center">
                        {/* Decorative Pattern */}
                        <div className="flex justify-center mb-6">
                          <div className="grid grid-cols-3 gap-2">
                            {[...Array(9)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-4 h-4 bg-orange-400 rounded-lg animate-pulse" 
                                style={{ animationDelay: `${i * 150}ms` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Large Year */}
                        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 mb-4">
                          {currentData.year}
                        </div>
                        
                        {/* Timeline Visualization */}
                        <div className="flex justify-center space-x-3">
                          {timelineData.map((item, index) => (
                            <div
                              key={item.year}
                              className={`h-2 rounded-full transition-all duration-500 ${
                                timelineData.findIndex(y => y.year === activeYear) >= index 
                                  ? 'bg-orange-500 w-8' 
                                  : 'bg-gray-300 w-4'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right - Content */}
                    <div className="col-span-8">
                      <div className="pl-8 border-l-4 border-orange-300">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                          {currentData.title}
                        </h2>
                        
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                          {currentData.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              const currentIndex = timelineData.findIndex(item => item.year === activeYear);
                              if (currentIndex > 0) {
                                setActiveYear(timelineData[currentIndex - 1].year);
                              }
                            }}
                            disabled={timelineData.findIndex(item => item.year === activeYear) === 0}
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous Era</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              const currentIndex = timelineData.findIndex(item => item.year === activeYear);
                              if (currentIndex < timelineData.length - 1) {
                                setActiveYear(timelineData[currentIndex + 1].year);
                              }
                            }}
                            disabled={timelineData.findIndex(item => item.year === activeYear) === timelineData.length - 1}
                            className="flex items-center space-x-2 px-6 py-3 bg-orange-400 hover:bg-orange-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>Next Era</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Stats */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-8 text-center">
                      {timelineData.map((item, index) => (
                        <div 
                          key={item.year}
                          className={`transition-all duration-300 ${
                            activeYear === item.year ? 'transform scale-105' : 'opacity-60'
                          }`}
                        >
                          <div className={`text-2xl font-bold mb-2 ${
                            activeYear === item.year ? 'text-orange-500' : 'text-gray-400'
                          }`}>
                            {item.year}
                          </div>
                          <div className="text-sm text-gray-500 leading-tight">
                            {item.title.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}