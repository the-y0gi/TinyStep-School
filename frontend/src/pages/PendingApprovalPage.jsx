import React from "react";
import { Clock } from "lucide-react";

const PendingApprovalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center max-w-md w-full">
        <div className="mb-6">
          <Clock className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mx-auto animate-pulse" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Pending for Approval
        </h1>

        <p className="text-gray-600 text-sm md:text-base">
          Your child's registration is under review by the school admin.
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
