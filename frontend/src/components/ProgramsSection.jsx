import React from "react";

export default function ProgramsSection() {
  return (
    <div className="bg-gray-100 py-16">
      {/* Our Programs Section */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Programs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our multi-level kindergarten cater to the age groups 2-5 years with
            a curriculum focussing children.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Sport Class */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-orange-200 transition-colors">
              <div className="text-orange-500 text-2xl">⚽</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Sport Class
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Each day at EduKid is a celebration. We celebrate all sports!
            </p>
          </div>

          {/* Music Class - Featured */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform md:-translate-y-4 hover:md:-translate-y-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform">
              <div className="text-blue-500 text-3xl">🎵</div>
            </div>
            <h3 className="text-xl font-bold mb-4">Music Class</h3>
            <p className="leading-relaxed opacity-90">
              Musical indoor and outdoor activities that cater to all growth &
              development
            </p>
          </div>

          {/* Drawing Class */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-orange-200 transition-colors">
              <div className="text-orange-500 text-2xl">🎨</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Drawing Class
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Fun Arts and Crafts projects for the children to work on together!
            </p>
          </div>
        </div>

        {/* Choose Classes Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Classes For Your Kid
          </h2>
          <p className="text-gray-600 text-lg">
            Explore Exciting Classes Designed For Curious Little Minds!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Settling */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
            <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src="https://plus.unsplash.com/premium_photo-1750373196311-1ed99d5c0603?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // replace with your image path
                alt="Settling"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Settling</h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                To round out our weekend of celebrations, we are holding our
                reunion.
              </p>
              <div className="flex space-x-2">
                <div className="bg-teal-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-teal-500 transition-colors">
                  <div className="font-bold">4-5</div>
                  <div className="text-xs">yrs</div>
                </div>
                <div className="bg-teal-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-teal-500 transition-colors">
                  <div className="font-bold">1</div>
                  <div className="text-xs">day</div>
                </div>
                <div className="bg-teal-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-teal-500 transition-colors">
                  <div className="font-bold">3.3</div>
                  <div className="text-xs">hrs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Play Group */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
            <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1746811988821-1bf3dc6eab3a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2lkcyUyMFBsYXklMjBHcm91cHxlbnwwfHwwfHx8MA%3D%3D" // replace with your image path
                alt="Play Group"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Play Group
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                We will be magically transforming the School's Sports Center
                into a full game area.
              </p>
              <div className="flex space-x-2">
                <div className="bg-orange-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-orange-500 transition-colors">
                  <div className="font-bold">1-2</div>
                  <div className="text-xs">yrs</div>
                </div>
                <div className="bg-orange-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-orange-500 transition-colors">
                  <div className="font-bold">5</div>
                  <div className="text-xs">day</div>
                </div>
                <div className="bg-orange-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-orange-500 transition-colors">
                  <div className="font-bold">3.3</div>
                  <div className="text-xs">hrs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Nursery */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
            <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img
                src="https://plus.unsplash.com/premium_photo-1750373197055-b9b056202540?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // replace with your image path
                alt="Pre-Nursery"
                className="h-full object-cover"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Pre-Nursery
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                EduKid is thrilled to teach pre-nursery courses to better the
                lives of our children.
              </p>
              <div className="flex space-x-2">
                <div className="bg-pink-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-pink-500 transition-colors">
                  <div className="font-bold">4-5</div>
                  <div className="text-xs">yrs</div>
                </div>
                <div className="bg-pink-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-pink-500 transition-colors">
                  <div className="font-bold">5</div>
                  <div className="text-xs">day</div>
                </div>
                <div className="bg-pink-400 text-white px-3 py-2 rounded-lg text-center flex-1 hover:bg-pink-500 transition-colors">
                  <div className="font-bold">3.3</div>
                  <div className="text-xs">hrs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
