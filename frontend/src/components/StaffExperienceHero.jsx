import React from 'react';

export default function StaffExperienceHero() {
  // Background image URL - aap yahan apni image ka URL add kar sakte hain
  const backgroundImageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  
  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[630px] min-h-[400px] overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImageUrl}')`
          }}
        >

        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              <span className="block">Take staff experience</span>
              <span className="block text-orange-400">to the next level!</span>
            </h1>
          </div>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Bottom Section */}
      <div className="bg-gray-100 pt-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-wider">
            STAFF
          </h2>
        </div>
      </div>
      
      {/* Enhanced Visual Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Floating particles for atmosphere */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-orange-400/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-1500"></div>
      </div>
    </div>
  );
}