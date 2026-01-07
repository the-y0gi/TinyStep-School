import { useState, useEffect } from "react";
import {
  fetchDashboardStats,
  fetchRecentActivity,
} from "../../services/adminAllAPI's.js";

// At the top of AdminDashboard.jsx
import StatCard from "../../pages/admin/StatCard.jsx"; // Add this import

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // In your loadDashboardData function:
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity(),
      ]);

      setStats(statsRes.data);
      setActivity(Array.isArray(activityRes.data) ? activityRes.data : []); // Ensure array
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setActivity([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-800">Overview Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                <StatCard
                  title="Total Students"
                  value={stats?.totalStudents}
                  icon="👦"
                />
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                <StatCard
                  title="Total Teachers"
                  value={stats?.totalTeachers}
                  icon="👩‍🏫"
                />
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                <StatCard
                  title="Pending Approvals"
                  value={stats?.pendingApprovals}
                  icon="⏳"
                />
              </div>
            </div>
            
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                <StatCard
                  title="Fee Collection"
                  value={`${stats?.feeCollectionRate}%`}
                  icon="💰"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-800">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Manage Students</h3>
                  <p className="text-blue-100 text-sm">Add, edit or view student records</p>
                </div>
              </div>
            </button>

            <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Course Management</h3>
                  <p className="text-emerald-100 text-sm">Manage courses and curriculum</p>
                </div>
              </div>
            </button>

            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reports</h3>
                  <p className="text-purple-100 text-sm">View detailed analytics & reports</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-600 to-red-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            {activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50/50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-slate-700">{item.description || 'Recent activity item'}</p>
                      <p className="text-slate-500 text-sm">{item.timestamp || 'Just now'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No Recent Activity</h3>
                <p className="text-slate-500">Activity will appear here once users start interacting with the system.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}