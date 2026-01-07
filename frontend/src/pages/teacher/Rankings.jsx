import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
import { format } from "date-fns";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

const Ranking = () => {
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("/teacher/classes/dropdown");
        setClassList(res.data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to load class list");
      }
    };

    fetchClasses();
  }, []);

  // Fetch rankings with debounce
  useEffect(() => {
    const fetchRankings = async () => {
      if (!selectedClass || !selectedMonth) {
        setRankings([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(
          `/teacher/ranking?classId=${selectedClass}&month=${selectedMonth}`
        );
        setRankings(res.data.data || []);
      } catch (err) {
        console.error("Ranking fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load rankings. Please try again."
        );
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(fetchRankings, 500);
    return () => clearTimeout(timerId);
  }, [selectedClass, selectedMonth]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-xl" />;
    if (rank === 3) return <FaAward className="text-amber-600 text-xl" />;
    return rank;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Class Rankings
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <input
              type="month"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={format(new Date(), "yyyy-MM")}
            />
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : rankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankings.map((item, index) => (
                    <tr
                      key={item.student._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                        <div className="flex items-center justify-center">
                          {getRankIcon(item.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {item.student.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.student.rollNumber || "—"}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.totalMarks}
                          <span className="text-gray-500">
                            {" "}
                            / {item.maxTotal}
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.totalMarks / item.maxTotal) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.totalMarks}
                          <span className="text-gray-500">
                            {" "}
                            / {item.maxTotal}
                          </span>
                          {item.published === false && (
                            <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                              Unpublished
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.percentage >= 80
                              ? "bg-green-100 text-green-800"
                              : item.percentage >= 50
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No rankings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedClass && selectedMonth
                  ? "No results published for the selected class and month."
                  : "Please select a class and month to view rankings."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
