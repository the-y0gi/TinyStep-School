import React from 'react';

export default function FeeStructure() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 border border-orange-300 rounded mb-4">
            <span className="text-orange-600 font-medium">Our Features</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Fee Structure</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our fee structure is transparent, and we strive to keep our fees competitive within the education sector. The 
            fees vary based on the program, age group and any additional services chosen.
          </p>
        </div>

        {/* Main Fee Structure Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 border-2 border-green-200">
          {/* Table Header */}
          <div className="bg-orange-300 px-4 py-3">
            <div className="grid grid-cols-5 gap-4 font-semibold text-gray-800">
              <div>Program</div>
              <div>Age Group</div>
              <div>Annual Tuition</div>
              <div>Registration Fee</div>
              <div>Activity Fee</div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-purple-50">
              <div className="font-medium text-gray-800">Nursery</div>
              <div className="text-gray-700">2 - 3 Years</div>
              <div className="text-gray-700">$1,656</div>
              <div className="text-gray-700">$162</div>
              <div className="text-gray-700">$12</div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-white">
              <div className="font-medium text-gray-800">Pre - Kindergarten</div>
              <div className="text-gray-700">3 - 4 Years</div>
              <div className="text-gray-700">$2,646</div>
              <div className="text-gray-700">$220</div>
              <div className="text-gray-700">$16</div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-purple-50">
              <div className="font-medium text-gray-800">Kindergarten</div>
              <div className="text-gray-700">4 - 5 Years</div>
              <div className="text-gray-700">$3,646</div>
              <div className="text-gray-700">$360</div>
              <div className="text-gray-700">$20</div>
            </div>
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-green-200">
          {/* Section Header */}
          <div className="bg-orange-300 px-4 py-3">
            <h2 className="font-semibold text-gray-800">Additional Services</h2>
          </div>

          {/* Services List */}
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-2 gap-4 px-4 py-4 bg-purple-50">
              <div className="font-medium text-gray-800">Before and After-School Care</div>
              <div className="text-gray-700">$300 / per month</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 px-4 py-4 bg-white">
              <div className="font-medium text-gray-800">Language Immersion Program</div>
              <div className="text-gray-700">$60 / per semester</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 px-4 py-4 bg-purple-50">
              <div className="font-medium text-gray-800">Transportation (optional)</div>
              <div className="text-gray-700">$80 / per month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}