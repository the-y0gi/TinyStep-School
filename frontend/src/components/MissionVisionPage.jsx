import React from 'react';

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        
        {/* Mission & Vision Section */}
        <section className="text-center space-y-8">
          {/* Header Badge */}
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              Mission & Visions
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 leading-tight">
            Our Mission & Visions
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            We are here to provide a nurturing and inclusive environment where young minds can thrive, fostering a love for learning and personal growth.
          </p>
          
          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-12">
            
            {/* Mission Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 text-left relative">
              {/* Mountain Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 relative">
                  <div className="absolute bottom-0 left-0 w-8 h-6 bg-gray-700 transform rotate-12 rounded-sm"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-8 bg-gray-600 transform -rotate-12 rounded-sm"></div>
                  <div className="absolute top-2 right-2 w-2 h-3 bg-orange-400 rounded-sm"></div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Mission
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                At Little Learners Academy, our mission is to inspire a passion for learning and empower young minds to become confident, compassionate, and creative individuals. We strive to create a safe and inclusive space where children thrive academically, socially, and emotionally, setting the stage for a successful educational journey.
              </p>
            </div>
            
            {/* Vision Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 text-left relative">
              {/* Binoculars Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 relative">
                  <div className="w-5 h-8 bg-gray-700 rounded-full absolute left-0 top-1"></div>
                  <div className="w-5 h-8 bg-gray-700 rounded-full absolute right-0 top-1"></div>
                  <div className="w-3 h-2 bg-orange-400 absolute left-1/2 top-3 transform -translate-x-1/2"></div>
                  <div className="w-4 h-6 bg-orange-400 rounded-full absolute left-1 top-2"></div>
                  <div className="w-4 h-6 bg-orange-400 rounded-full absolute right-1 top-2"></div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Vision
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                Our vision is to be a beacon of educational excellence, where children are encouraged to explore, discover, and express their unique talents. We aim to foster a generation of lifelong learners equipped with critical thinking, empathy, and a deep appreciation for diversity.
              </p>
            </div>
          </div>
        </section>
        
        {/* Awards Section */}
        <section className="text-center space-y-8">
          {/* Awards Header Badge */}
          <div className="inline-block">
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
              Our Achievements
            </span>
          </div>
          
          {/* Awards Title */}
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
            Our Awards and Recognitions
          </h2>
          
          {/* Awards Description */}
          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Little Learners Academy takes pride in our commitment to delivering high-quality education and outstanding student experiences. 
            We are honored to have received various awards and recognitions for our dedication to early childhood education. These accolades 
            reflect our team's relentless efforts in creating an exceptional learning environment for our students.
          </p>
          
          {/* Awards Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            
            {/* Outstanding Early Childhood Education Award */}
            <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-16 h-16 border-4 border-purple-500 rounded-full opacity-30"></div>
              <div className="absolute top-8 right-8 w-8 h-8 border-4 border-purple-600 rounded-full opacity-50"></div>
              
              {/* Award Icon */}
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Outstanding Early Childhood
              </h3>
              <h4 className="text-lg font-medium text-purple-700 italic mb-4">
                Education Award
              </h4>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                Outstanding Early Childhood Education Award by Little Learners Academy for excellence in nurturing and early education.
              </p>
            </div>
            
            {/* Innovative STEAM Education Award */}
            <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden text-white">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 transform rotate-12"></div>
              <div className="absolute top-8 right-12 w-6 h-6 bg-yellow-300 transform -rotate-12"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 bg-yellow-400 rounded-full"></div>
              
              {/* Award Icon */}
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-white rounded-sm opacity-80"></div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                Innovative STEAM
              </h3>
              <h4 className="text-lg font-medium italic mb-4 text-blue-100">
                Education Award
              </h4>
              
              <p className="text-blue-50 text-sm leading-relaxed">
                Innovative STEAM Education Award by the Education Excellence Association for pioneering creative, critical-thinking STEAM programs.
              </p>
            </div>
            
            {/* Environmental Stewardship Award */}
            <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden md:col-span-2 lg:col-span-1">
              {/* Decorative star */}
              <div className="absolute top-4 right-4 w-16 h-16 opacity-30">
                <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              
              {/* Award Icon */}
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Environmental stewardship
              </h3>
              <h4 className="text-lg font-medium text-orange-700 italic mb-4">
                Award
              </h4>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                the Education Excellence Association for pioneering creative, critical-thinking STEAM programs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}