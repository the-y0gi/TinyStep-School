import React from "react";
import { useNavigate } from "react-router-dom";

const GalleryComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
            Our Gallery
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover moments of joy, learning, and creativity in our vibrant
            community
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-8 mb-16">
          {/* Image 1 - Large featured */}
          <div className="col-span-2 lg:col-span-5 row-span-1 lg:row-span-2 group cursor-pointer">
            <div className="relative h-64 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-3 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-amber-900 p-6">
                {/* <div className="text-6xl lg:text-8xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                  🎨
                </div> */}
                <h3 className="text-xl lg:text-3xl font-black mb-2 text-center tracking-tight">
                  Creative Arts
                </h3>
                <p className="text-sm lg:text-base opacity-90 text-center max-w-xs leading-relaxed">
                  Unleashing imagination through colors and endless creativity
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1658786335153-b4035c0e09da?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Creative Arts"
              />

              <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Image 2 - Medium */}
          <div className="col-span-1 lg:col-span-4 group cursor-pointer">
            <div className="relative h-44 lg:h-52 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-2 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-400"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center  text-amber-900 p-4">
                {/* <div className="text-4xl lg:text-6xl mb-2 lg:mb-3 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-400 filter drop-shadow-md">
                  🧩
                </div> */}
                <h3 className="text-base lg:text-xl font-bold mb-1 text-center">
                  Learning Hub
                </h3>
                <p className="text-xs lg:text-sm opacity-90 text-center leading-snug">
                  Interactive education experiences
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1541802802036-1d572ba70147?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Learning Hub"
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Image 3 - Medium */}
          <div className="col-span-1 lg:col-span-3 group cursor-pointer">
            <div className="relative h-44 lg:h-52 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-2 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-400"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center  text-white p-4">
                {/* <div className="text-4xl lg:text-6xl mb-2 lg:mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-400 filter drop-shadow-md">
                  🤝
                </div> */}
                <h3 className="text-base lg:text-xl font-bold mb-1 text-center">
                  Team Spirit
                </h3>
                <p className="text-xs lg:text-sm opacity-90 text-center leading-snug">
                  Building lasting connections
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1694656501981-ec151673b5e3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Spirit"
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Image 4 - Tall */}
          <div className="col-span-1 lg:col-span-3 lg:row-span-1 group cursor-pointer">
            <div className="relative h-36 lg:h-64 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-2 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-400 to-lime-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-400"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-amber-900 p-4">
                {/* <div className="text-4xl lg:text-6xl mb-2 lg:mb-3 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-400 filter drop-shadow-md">
                  🏃‍♀️
                </div> */}
                <h3 className="text-base lg:text-xl font-bold mb-1 text-center">
                  Active Life
                </h3>
                <p className="text-xs lg:text-sm opacity-90 text-center leading-snug px-2">
                  Healthy movement & energy
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1538406591119-40008402470a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Active Life"
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-lime-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Image 5 - Wide */}
          <div className="col-span-1 lg:col-span-4 group cursor-pointer">
            <div className="relative h-36 lg:h-64 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-2 hover:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-all duration-400"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-4">
                {/* <div className="text-4xl lg:text-6xl mb-2 lg:mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-400 filter drop-shadow-md">
                  👫
                </div> */}
                <h3 className="text-base lg:text-xl font-bold mb-1 text-center">
                  Friendship
                </h3>
                <p className="text-xs lg:text-sm opacity-90 text-center leading-snug">
                  Creating lasting bonds together
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1548077880-656c402b344e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Friendship"
              />

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          {/* Image 6 - Large square */}
          <div className="col-span-2 lg:col-span-5 group cursor-pointer">
            <div className="relative h-48 lg:h-72 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-3 hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-amber-900 p-6">
                {/* <div className="text-5xl lg:text-8xl mb-3 lg:mb-4 transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 filter drop-shadow-lg">
                  ✂️
                </div> */}
                <h3 className="text-xl lg:text-3xl font-black mb-2 text-center tracking-tight">
                  Craft Workshop
                </h3>
                <p className="text-sm lg:text-base opacity-90 text-center max-w-sm leading-relaxed">
                  Hands-on creative experiences and artistic discovery
                </p>
              </div>

              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1553048258-711f6c7a44fe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Craft Workshop"
              />

              <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>

        {/* View Gallery Button */}
        <div className="text-center">
          <button className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
            <span className="relative z-10" onClick={()=> navigate('/gallery')}>EXPLORE GALLERY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryComponent;
