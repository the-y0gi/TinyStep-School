import React from 'react';
import { Phone, Users, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-300 via-yellow-300 to-orange-300 min-h-[300px] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Large curved shapes */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-purple-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 left-32 w-80 h-80 bg-purple-600 rounded-full opacity-15"></div>
        
        {/* Dotted pattern on the right */}
        <div className="absolute top-16 right-32 grid grid-cols-10 gap-3">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-white rounded-full opacity-40"></div>
          ))}
        </div>
        
        {/* Additional decorative circles */}
        <div className="absolute top-20 right-16 w-16 h-16 bg-purple-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-yellow-200 rounded-full opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-12 items-start">
            {/* Company Info Column */}
            <div className="col-span-1">
              {/* Logo and Tagline */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <Users className="text-red-500 w-10 h-10 mr-3" />
                  <h1 className="text-4xl font-semibold text-red-500">Tinysteps</h1>
                </div>
                <p className="text-gray-700 text-base">Making learning fun</p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="text-gray-700">
                  <p className="font-medium text-lg">Westlands Building,</p>
                  <p className="font-medium text-lg">Nairobi, KE</p>
                  <p className="font-semibold text-xl text-gray-800 mt-2">0654359090</p>
                </div>
                <p className="text-blue-600 text-base hover:text-blue-800 transition-colors cursor-pointer">
                  eduaddsupport@email.com
                </p>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="col-span-1">
              <h3 className="text-gray-800 font-bold mb-6 text-xl">Quick Links</h3>
              <div className="space-y-4">
                <a 
                  href="/about" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  About
                </a>
                <a 
                  href="/courses" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Courses
                </a>
                <a 
                  href="/shop" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Shop
                </a>
                <a 
                  href="/contact" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Contact
                </a>
                <a 
                  href="/blog" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Blog
                </a>
              </div>
            </div>

            {/* Quick Links Column 2 */}
            <div className="col-span-1">
              <h3 className="text-gray-800 font-bold mb-6 text-xl">More Links</h3>
              <div className="space-y-4">
                <a 
                  href="/recently-viewed" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Recently Viewed
                </a>
                <a 
                  href="/new-programs" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  New programs
                </a>
                <a 
                  href="/curriculums" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Curriculums
                </a>
                <a 
                  href="/career" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  Career
                </a>
                <a 
                  href="/school-stuff" 
                  className="block text-gray-700 hover:text-gray-900 hover:translate-x-2 transition-all duration-200 text-lg font-medium"
                >
                  School stuff
                </a>
              </div>
            </div>

            {/* Social & Contact Column */}
            <div className="col-span-1">
              <h3 className="text-gray-800 font-bold mb-6 text-xl">Connect With Us</h3>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mb-8">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transform hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transform hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transform hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="YouTube"
                >
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              </div>

              {/* Call for Inquiries */}
              <div className="bg-white bg-opacity-30 p-4 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Call for inquiries:</p>
                    <p className="text-gray-900 font-bold text-lg">066 999 9999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <div className="mb-8">
            {/* Logo and Tagline */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="text-red-500 w-8 h-8 mr-2" />
                <h1 className="text-3xl font-bold text-red-500">Tinysteps</h1>
              </div>
              <p className="text-gray-700 text-sm">Making learning fun</p>
            </div>

            {/* Contact Information and Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">Westlands Building,</p>
                <p className="text-gray-700 font-medium">Nairobi, KE</p>
                <p className="text-gray-700 font-medium">0654359090</p>
                <p className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                  eduaddsupport@email.com
                </p>
              </div>

              {/* Quick Links Column 1 */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-4 text-lg">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/about" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">About</a>
                  <a href="/courses" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Courses</a>
                  <a href="/shop" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Shop</a>
                  <a href="/contact" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Contact</a>
                  <a href="/blog" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Blog</a>
                </div>
              </div>

              {/* Quick Links Column 2 */}
              <div>
                <h3 className="text-gray-800 font-semibold mb-4 text-lg opacity-0 md:opacity-100">Links</h3>
                <div className="space-y-2">
                  <a href="/recently-viewed" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Recently Viewed</a>
                  <a href="/new-programs" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">New programs</a>
                  <a href="/curriculums" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Curriculums</a>
                  <a href="/career" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">Career</a>
                  <a href="/school-stuff" className="block text-gray-700 hover:text-gray-900 hover:underline transition-all duration-200">School stuff</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Social Media and Phone */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-yellow-500 border-opacity-30">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transform hover:scale-110 transition-all duration-200" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transform hover:scale-110 transition-all duration-200" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transform hover:scale-110 transition-all duration-200" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Call for Inquiries */}
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <Phone className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Call for inquiries:</span>
              <span className="text-gray-900 font-bold">066 999 9999</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;