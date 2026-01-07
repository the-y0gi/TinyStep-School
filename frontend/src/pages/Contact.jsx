import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect fill="%23444" width="1200" height="400"/><g fill="%23666"><rect x="50" y="100" width="80" height="200"/><rect x="180" y="80" width="80" height="220"/><rect x="310" y="100" width="80" height="200"/><rect x="440" y="90" width="80" height="210"/><rect x="570" y="100" width="80" height="200"/><rect x="700" y="80" width="80" height="220"/><rect x="830" y="100" width="80" height="200"/><rect x="960" y="90" width="80" height="210"/><rect x="1090" y="100" width="80" height="200"/></g></svg>')`
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact us</h1>
          <p className="text-sm md:text-base max-w-md mx-auto">
            If you have any questions, feel free to fill out the form below.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nikaan Anderson"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nikaan@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Hi there..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 transform hover:scale-105"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-full min-h-96 relative">
              {/* Map Placeholder with Interactive Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                {/* Simulated Map Interface */}
                <div className="relative w-full h-full">
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                    <button className="bg-white shadow-md rounded px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                      +
                    </button>
                    <button className="bg-white shadow-md rounded px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                      -
                    </button>
                  </div>

                  {/* Location Markers */}
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-2 mt-2 min-w-max text-xs">
                      <div className="font-semibold">SMP Negeri 1 Cibadak</div>
                      <div className="text-gray-600">School Location</div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(4)}{'☆'.repeat(1)}
                        </div>
                        <span className="ml-1 text-gray-500">4.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-2 mt-2 min-w-max text-xs">
                      <div className="font-semibold">Hotel Sakanongi</div>
                      <div className="text-gray-600">Hotel & Lodging</div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(3)}{'☆'.repeat(2)}
                        </div>
                        <span className="ml-1 text-gray-500">3.4</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 w-6 h-6 rounded-full shadow-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-2 mt-2 min-w-max text-xs">
                      <div className="font-semibold">SMP NEGERI 2 CIBADAK</div>
                      <div className="text-gray-600">Educational Institution</div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-orange-500 w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-2 mt-2 min-w-max text-xs">
                      <div className="font-semibold">Warung Mama Faiz</div>
                      <div className="text-gray-600">Restaurant</div>
                    </div>
                  </div>

                  {/* Road/Path Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M50 200 Q300 150 500 250 T800 200"
                      stroke="#60A5FA"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                    />
                    <path
                      d="M200 50 Q400 300 600 400"
                      stroke="#60A5FA"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>

                  {/* Map Attribution */}
                  <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
                    © Interactive Map
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Phone className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Mail className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600">contact@example.com</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-600">123 Main St, City, State 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}


