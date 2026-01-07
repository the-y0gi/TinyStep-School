import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter } from 'lucide-react';

const ActivitiesEventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [animateCards, setAnimateCards] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Storytime Hour',
      date: '22 Feb, Fri',
      time: '4:30 PM - 5:30 PM',
      category: 'Party',
      color: 'bg-green-100 border-green-300',
      participants: 25,
      location: 'Main Hall'
    },
    {
      id: 2,
      title: 'Art And Craft Day',
      date: '13 Jan, Mon',
      time: '2:30 PM - 3:30 PM',
      category: 'Outdoor',
      color: 'bg-blue-100 border-blue-300',
      participants: 18,
      location: 'Art Studio'
    },
    {
      id: 3,
      title: 'Nature Walk',
      date: '16 Mar, Tue',
      time: '4:30 PM - 5:30 PM',
      category: 'Outdoor',
      color: 'bg-purple-100 border-purple-300',
      participants: 12,
      location: 'Garden Trail'
    },
    {
      id: 4,
      title: 'Science Day',
      date: '19 Apr, Sun',
      time: '1:00 PM - 2:30 PM',
      category: 'Sports',
      color: 'bg-yellow-100 border-yellow-300',
      participants: 30,
      location: 'Science Lab'
    },
    {
      id: 5,
      title: 'Music And Dance Party',
      date: '12 Jan, Sun',
      time: '3:30 PM - 5:30 PM',
      category: 'Party',
      color: 'bg-pink-100 border-pink-300',
      participants: 40,
      location: 'Music Room'
    },
    {
      id: 6,
      title: 'Field Trip',
      date: '06 Feb, Tue',
      time: '2:30 PM - 3:30 PM',
      category: 'Outdoor',
      color: 'bg-indigo-100 border-indigo-300',
      participants: 22,
      location: 'Museum'
    },
    {
      id: 7,
      title: 'Celebration Of Cultures',
      date: '26 Aug, Fri',
      time: '12:30 PM - 3:30 PM',
      category: 'Party',
      color: 'bg-red-100 border-red-300',
      participants: 50,
      location: 'Main Auditorium'
    },
    {
      id: 8,
      title: 'Sports Day',
      date: '17 Feb, Tue',
      time: '2:00 PM - 3:00 PM',
      category: 'Sports',
      color: 'bg-orange-100 border-orange-300',
      participants: 35,
      location: 'Sports Ground'
    }
  ];

  const filterButtons = ['All', 'Outdoor', 'Party', 'Sports'];

  useEffect(() => {
    setAnimateCards(true);
    if (activeFilter === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === activeFilter));
    }
    
    const timer = setTimeout(() => setAnimateCards(false), 600);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 transform transition-all duration-1000 ease-out">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
            Our Activities & Events
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterButtons.map((filter, index) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`
                px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95
                ${activeFilter === filter
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <Filter className="inline-block w-4 h-4 mr-2" />
              {filter}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`
                ${event.color} rounded-2xl p-6 border-2 cursor-pointer group
                transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                ${animateCards ? 'animate-pulse' : ''}
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: animateCards ? 'slideInUp 0.6s ease-out forwards' : 'none'
              }}
            >
              {/* Date Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {event.date}
                </div>
                <div className="bg-white bg-opacity-60 rounded-full p-2 group-hover:bg-opacity-80 transition-all duration-300">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Event Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-gray-900 transition-colors duration-300">
                {event.title}
              </h3>

              {/* Time */}
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">{event.time}</span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{event.location}</span>
              </div>

          

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No events found for this category</div>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300"
            >
              Show All Events
            </button>
          </div>
        )}
   
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ActivitiesEventsPage;