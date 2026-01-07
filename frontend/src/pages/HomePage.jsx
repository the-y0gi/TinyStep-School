import React from "react";
import { Menu, Search, Phone, ChevronDown } from "lucide-react";
import ProgramsSection from "../components/ProgramsSection";
import ActivitiesEventsPage from "../components/ActivitiesEventsPage";
import GalleryComponent from "../components/GalleryComponent";
import TinystepsWelcome from "../components/TinystepsWelcome";
import OurBestTeachers from "../components/OurBestTeachers";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate= useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[95vh] bg-gradient-to-r from-orange-400 to-pink-400 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1554721299-e0b8aa7666ce?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2Nob29sJTIwa2lkc3xlbnwwfHwwfHx8MA%3D%3D)",
          }}
        ></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-center mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Great Platform For
              <br />
              Little Explorers
            </h1>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-70"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-green-300 rounded-full opacity-70"></div>
        <div className="absolute bottom-10 left-20 w-10 h-10 bg-blue-300 rounded-full opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-pink-300 rounded-full opacity-70"></div>
      </section>

      {/* Wave Divider */}
      <div className="bg-gray-50 relative">
        <svg
          className="absolute top-0 w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="#f9fafb"
          />
        </svg>
        <div className="pt-20">
          {/* Features Icons */}
          <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Infinite Sliding Carousel for all screens */}
            <div className="overflow-hidden">
              <div className="flex animate-scroll">
                {/* First set of icons */}
                <div className="flex flex-shrink-0">
                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎮</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Gaming Playground
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🏠</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Happy Environment
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎨</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Creative Course
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">📚</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Active Learning
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">👩‍🏫</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Qualified Teachers
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎯</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Colorful Classrooms
                    </h3>
                  </div>
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex flex-shrink-0">
                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎮</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Gaming Playground
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🏠</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Happy Environment
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎨</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Creative Course
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">📚</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Active Learning
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">👩‍🏫</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Qualified Teachers
                    </h3>
                  </div>

                  <div className="text-center mx-4 lg:mx-8">
                    <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white text-2xl">🎯</div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                      Colorful Classrooms
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-200 to-pink-200 rounded-3xl p-8 transform rotate-3">
                  <div className="bg-white rounded-2xl p-4 transform -rotate-3">
                    <div className="bg-gradient-to-br from-red-400 to-pink-400 rounded-xl h-64 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1661963297627-92799f5658fd?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGtpZHMlMjBzY2hvb2x8ZW58MHx8MHx8fDA%3D" // replace with your actual path or URL
                        alt="Decorative"
                        className="h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-300 rounded-full"></div>
                <div className="absolute top-10 -right-8 w-6 h-6 bg-green-300 rounded-full"></div>
                <div className="absolute bottom-16 -left-8 w-10 h-10 bg-pink-300 rounded-full opacity-70"></div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Welcome To Our Kindergarten
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>We're so happy to have you here!</p>
                  <p>
                    At Tinysteps school, learning is fun, playful, and full of
                    smiles.
                  </p>
                  <p>
                    Our caring teachers help little stars grow, explore, and
                    shine every day.
                  </p>
                </div>
                {/* <button onClick={()=>navigate('/admission-detail')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold mt-8 transition-colors">
                  ABOUT US
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProgramsSection />
      <ActivitiesEventsPage />
      <GalleryComponent />
      <TinystepsWelcome />
      <OurBestTeachers />
    </div>
  );
}
