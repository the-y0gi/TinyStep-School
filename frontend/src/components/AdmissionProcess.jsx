import React from 'react';

export default function AdmissionProcess() {
  const topRowCards = [
    {
      id: 1,
      title: "Inquiry",
      description: "Submit an inquiry on our website or contact admissions to express interest in Little Learners Academy.",
      image: "https://images.unsplash.com/photo-1544776527-6bac3d0c8c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-blue-50",
      titleColor: "text-blue-600"
    },
    {
      id: 2,
      title: "School Tour",
      description: "Book a school tour to explore our campus, meet staff, and experience our nurturing environment.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-pink-50",
      titleColor: "text-pink-600"
    },
    {
      id: 3,
      title: "Application Form",
      description: "Complete the application and submit your child's birth certificate, medical and academic records.",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-orange-50",
      titleColor: "text-orange-600"
    },
    // Duplicate for infinite loop
    {
      id: 4,
      title: "Inquiry",
      description: "Submit an inquiry on our website or contact admissions to express interest in Little Learners Academy.",
      image: "https://images.unsplash.com/photo-1544776527-6bac3d0c8c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-blue-50",
      titleColor: "text-blue-600"
    },
    {
      id: 5,
      title: "School Tour",
      description: "Book a school tour to explore our campus, meet staff, and experience our nurturing environment.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-pink-50",
      titleColor: "text-pink-600"
    },
    {
      id: 6,
      title: "Application Form",
      description: "Complete the application and submit your child's birth certificate, medical and academic records.",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-orange-50",
      titleColor: "text-orange-600"
    }
  ];

  const bottomRowCards = [
    {
      id: 1,
      title: "Parent Interview",
      description: "Meet with our admissions team to ensure we align with your child's needs and your family's goals.",
      image: "https://images.unsplash.com/photo-1567654669049-83b0bf2e34e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-cyan-50",
      titleColor: "text-cyan-600"
    },
    {
      id: 2,
      title: "Student Assessment",
      description: "A student assessment may be conducted to ensure proper placement based on developmental progress.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-red-50",
      titleColor: "text-red-600"
    },
    {
      id: 3,
      title: "Acceptance",
      description: "After completing admission, you'll receive an official acceptance letter from Little Learners Academy.",
      image: "https://images.unsplash.com/photo-1581579186913-15d5ddeaedeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-purple-50",
      titleColor: "text-purple-600"
    },
    // Duplicate for infinite loop
    {
      id: 4,
      title: "Parent Interview",
      description: "Meet with our admissions team to ensure we align with your child's needs and your family's goals.",
      image: "https://images.unsplash.com/photo-1567654669049-83b0bf2e34e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-cyan-50",
      titleColor: "text-cyan-600"
    },
    {
      id: 5,
      title: "Student Assessment",
      description: "A student assessment may be conducted to ensure proper placement based on developmental progress.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-red-50",
      titleColor: "text-red-600"
    },
    {
      id: 6,
      title: "Acceptance",
      description: "After completing admission, you'll receive an official acceptance letter from Little Learners Academy.",
      image: "https://images.unsplash.com/photo-1581579186913-15d5ddeaedeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bgColor: "bg-purple-50",
      titleColor: "text-purple-600"
    }
  ];

  const Card = ({ card }) => (
    <div className={`${card.bgColor} rounded-2xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 w-[250px] sm:w-[350px] h-[120px] sm:h-[140px] flex-shrink-0 mx-1.5 border border-white/40 relative overflow-hidden group`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-current"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        {/* Image */}
        <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className={`text-xs sm:text-sm font-bold ${card.titleColor} mb-1 line-clamp-1`}>
            {card.title}
          </h3>
          <p className="text-gray-600 text-[10px] sm:text-xs leading-tight line-clamp-3 overflow-hidden">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <div className="inline-block bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 sm:mb-6 shadow-sm">
          Process
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
          Admission Process
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4">
          Embark on a remarkable educational journey with us! Our Admission and Enrollment process is the gateway 
          to providing your child with an exceptional learning experience at our kindergarten school.
        </p>
      </div>

      {/* Top Row - Left to Right Animation */}
      <div className="mb-8 sm:mb-12">
        <div className="flex animate-scroll-left">
          {topRowCards.map((card, index) => (
            <Card key={`top-${card.id}-${index}`} card={card} />
          ))}
        </div>
      </div>

      {/* Bottom Row - Right to Left Animation */}
      <div className="mb-8 sm:mb-12">
        <div className="flex animate-scroll-right">
          {bottomRowCards.map((card, index) => (
            <Card key={`bottom-${card.id}-${index}`} card={card} />
          ))}
        </div>
      </div>

      {/* Bottom Decorative Section */}
      <div className="max-w-4xl mx-auto text-center mt-12 sm:mt-16 px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Our admission process is designed to ensure the best fit for your child's educational journey. 
            Each step is carefully crafted to understand your family's needs and showcase our commitment to excellence.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 20s linear infinite;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }

          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}