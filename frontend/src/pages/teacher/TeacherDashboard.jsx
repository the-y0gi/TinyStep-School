import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader"; 
import { CalendarDays, Users, BookOpenText, Clock3 } from "lucide-react";
import axiosInstance from "../../services/axiosConfig";

const TeacherDashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    classesWithPendingAttendance: 0,
    testsThisMonth: 0,
    recentActivity: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get("/teacher/dashboard");
      setData(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Hi, Welcome back 👋</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <Users className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-lg font-bold">{data.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <CalendarDays className="text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Attendance Pending</p>
            <p className="text-lg font-bold">{data.classesWithPendingAttendance}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <BookOpenText className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Tests This Month</p>
            <p className="text-lg font-bold">{data.testsThisMonth}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <Clock3 className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Recent Activity</p>
            {data.recentActivity ? (
              <>
                <p className="text-base font-semibold capitalize">
                  {data.recentActivity.type}
                </p>
                <p className="text-xs text-muted-foreground text-gray-400">
                  {new Date(data.recentActivity.date).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-gray-400">
                No activity yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;