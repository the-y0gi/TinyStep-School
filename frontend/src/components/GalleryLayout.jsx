
import React from 'react';

export default function GalleryLayout() {
  // Sample image URLs - aap yahan apni images ke URLs add kar sakte hain
  const images = [
    {
      id: 1,
      url: "https://plus.unsplash.com/premium_photo-1681842143575-03bf1be4c11c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2hpbGRyZW4lMjBwbGF5aW5nJTIwaW4lMjBjbGFzc3Jvb218ZW58MHx8MHx8fDA%3D",
      size: "large", // 2x2 grid
      alt: "Children playing in classroom"
    },
    {
      id: 2,
      url: "https://plus.unsplash.com/premium_photo-1663054455997-b3a3db390b49?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S2lkcyUyMHdpdGglMjB0ZWFjaGVyfGVufDB8fDB8fHww",
      size: "wide", // 2x1 grid
      alt: "Kids with teacher"
    },
    {
      id: 3,
      url: "https://plus.unsplash.com/premium_photo-1661270548822-8e9da5e6c6d5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Children exercising"
    },
    {
      id: 4,
      url: "https://plus.unsplash.com/premium_photo-1663099314737-b3dc41bfb377?q=80&w=891&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "tall", // 1x2 grid
      alt: "Kids on yellow bean bag"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1549737221-bef65e2604a6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2lkcyUyMHJlYWRpbmd8ZW58MHx8MHx8fDA%3D",
      size: "wide", // 2x1 grid
      alt: "Children reading"
    },
    {
      id: 6,
      url: "https://plus.unsplash.com/premium_photo-1701984401303-011fdbf35524?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S2lkcyUyMHBsYXlpbmclMjB3aXRoJTIwdG95fGVufDB8fDB8fHww",
      size: "small", // 1x1 grid
      alt: "Kids playing with toys"
    },
    {
      id: 7,
      url: "https://plus.unsplash.com/premium_photo-1663054510163-c19544ba7dfe?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2hpbGRyZW4lMjBpbiUyMGNsYXNzcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Children in classroom"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "wide", // 2x1 grid
      alt: "Teacher with students"
    },
    {
      id: 9,
      url: "https://plus.unsplash.com/premium_photo-1686920244658-f3db03fe22e3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2lkcyUyMHBsYXlpbmd8ZW58MHx8MHx8fDA%3D",
      size: "small", // 1x1 grid
      alt: "Kids playing"
    },
    {
      id: 10,
      url: "https://plus.unsplash.com/premium_photo-1683147681023-fe99f8746987?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "tall", // 1x2 grid
      alt: "Creative kids"
    },
    {
      id: 11,
      url: "https://plus.unsplash.com/premium_photo-1744718956674-8d69479f4baa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "wide", // 2x1 grid
      alt: "Kids learning together"
    },
    {
      id: 12,
      url: "https://plus.unsplash.com/premium_photo-1661478038806-9223c618fc9c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Happy children"
    },
    {
      id: 13,
      url: "https://plus.unsplash.com/premium_photo-1687757711100-753fee8a6040?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8a2lkcyUyMHBsYXlpbmclMjBnYW1lc3xlbnwwfHwwfHx8MA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Kids playing games"
    },
    {
      id: 14,
      url: "https://plus.unsplash.com/premium_photo-1701984401566-21ae06141500?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "large", // 2x2 grid
      alt: "Classroom activities"
    },
    {
      id: 15,
      url: "https://plus.unsplash.com/premium_photo-1686836995013-be7115bf463d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Children exploring"
    },
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1648420325602-0476ebe076d9?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXJ0JTIwYW5kJTIwY3JlYXRpdml0eSUyMGtpZHN8ZW58MHx8MHx8fDA%3D",
      size: "tall", // 1x2 grid
      alt: "Art and creativity"
    },
    {
      id: 17,
      url: "https://plus.unsplash.com/premium_photo-1686920245996-ab325a1016f9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "wide", // 2x1 grid
      alt: "Group activities"
    },
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1642252429939-3f9232959eb9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      size: "small", // 1x1 grid
      alt: "Playful moments"
    }
  ];

  const getSizeClasses = (size) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2 md:aspect-square'; // Mobile: 2x2, Desktop: 2x2
      case 'wide':
        return 'col-span-2 row-span-1 aspect-[2/1] md:col-span-2 md:row-span-1 md:aspect-[2/1]'; // Mobile: 2x1, Desktop: 2x1
      case 'tall':
        return 'col-span-1 row-span-1 aspect-square md:col-span-1 md:row-span-2 md:aspect-[1/2]'; // Mobile: 1x1 (no tall), Desktop: 1x2
      case 'small':
        return 'col-span-1 row-span-1 aspect-square md:col-span-1 md:row-span-1 md:aspect-square'; // Mobile: 1x1, Desktop: 1x1
      default:
        return 'col-span-1 row-span-1 aspect-square md:col-span-1 md:row-span-1 md:aspect-square';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 mt-18">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 left-1/4 w-10 h-10 text-orange-400 animate-pulse">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="absolute -top-4 right-1/4 w-8 h-8 text-pink-400 animate-bounce">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div className="absolute -bottom-3 left-1/3 w-6 h-6 text-blue-400 animate-pulse">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,20 2,20"/>
            </svg>
          </div>
          <div className="absolute -bottom-5 right-1/3 w-9 h-9 text-green-400 animate-bounce">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg">
            GALLERY
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mt-4"></div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-6 lg:gap-6 auto-rows-min">
          {images.map((image) => (
            <div
              key={image.id}
              className={`${getSizeClasses(image.size)} relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer bg-white/20 backdrop-blur-sm border border-white/30`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-125 group-hover:rotate-1"
                loading="lazy"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Simple hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>

              {/* Image label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-sm font-medium drop-shadow-lg">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative section */}
      <div className="max-w-7xl mx-auto mt-16 relative">
        <div className="absolute bottom-0 left-8 w-8 h-8 text-blue-400 animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <div className="absolute bottom-6 right-8 w-10 h-10 text-pink-400 animate-bounce">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 22,20 2,20"/>
          </svg>
        </div>
        
        {/* Footer text */}
        <div className="text-center py-12">
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl">
            <p className="text-gray-700 text-sm md:text-base max-w-4xl mx-auto leading-relaxed font-medium">
              Explore our vibrant gallery showcasing moments of joy, learning, and creativity. Each image captures the essence of childhood wonder and educational excellence in our nurturing environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}