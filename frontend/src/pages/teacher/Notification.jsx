import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    recipients: {
      allParents: false,
      specificParents: [],
      classIds: [],
    },
  });

  const [assignedClasses, setAssignedClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // for edit mode

  useEffect(() => {
    fetchClasses();
    fetchNotifications();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/teacher/classes/dropdown");
      setAssignedClasses(res.data || []);
    } catch (err) {
      console.error("Error fetching classes", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/teacher/notifications");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      recipients: {
        ...form.recipients,
        [name]: checked,
      },
    });
  };

  const handleClassSelect = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        classIds: value ? [value] : [],
      },
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      type: "general",
      recipients: {
        allParents: false,
        specificParents: [],
        classIds: [],
      },
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // update logic
        await axiosInstance.put(`/teacher/notifications/${editId}`, form);
      } else {
        // create logic
        await axiosInstance.post("/teacher/notifications", form);
      }
      fetchNotifications();
      resetForm();
    } catch (err) {
      console.error("Error submitting notification", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notification) => {
    setForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      recipients: {
        allParents: notification.recipients.allParents || false,
        specificParents: [],
        classIds: notification.recipients.classIds || [],
      },
    });
    setEditId(notification._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await axiosInstance.delete(`/teacher/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      general: "bg-blue-50 text-blue-700 border-blue-200",
      fee: "bg-orange-50 text-orange-700 border-orange-200",
      attendance: "bg-red-50 text-red-700 border-red-200",
      event: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[type] || colors.general;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Send and manage notifications to parents
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Notification Form */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 lg:p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                {editId ? "Edit Notification" : "Create Notification"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter notification title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message here..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm lg:text-base"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base"
                >
                  <option value="general">📢 General</option>
                  <option value="fee">💳 Fee</option>
                  <option value="attendance">📅 Attendance</option>
                  <option value="event">🎉 Event</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allParents"
                      checked={form.recipients.allParents}
                      onChange={handleCheckbox}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        All Parents
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Send to all parents in your assigned classes
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Specific Class
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm lg:text-base"
                    onChange={handleClassSelect}
                    value={form.recipients.classIds[0] || ""}
                    disabled={form.recipients.allParents}
                  >
                    <option value="">-- Choose a class --</option>
                    {assignedClasses.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm lg:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : editId ? (
                    "Update Notification"
                  ) : (
                    "Send Notification"
                  )}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm lg:text-base"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Notification List */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                Sent Notifications
              </h2>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {notifications.length}
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm lg:text-base">
                  No notifications sent yet
                </p>
                <p className="text-gray-400 text-xs lg:text-sm mt-1">
                  Your sent notifications will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                            {n.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                              n.type
                            )}`}
                          >
                            {n.type}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs lg:text-sm leading-relaxed mb-3 line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            Sent {formatDistanceToNow(new Date(n.createdAt))}{" "}
                            ago
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button
                          onClick={() => handleEdit(n)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit notification"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
