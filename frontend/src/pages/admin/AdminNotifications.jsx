import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    recipients: {
      allParents: false,
      allTeachers: false,
      specificParents: [],
      classIds: [],
    },
  });
  const [allParents, setAllParents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchInitialData = async () => {
    const [parentsRes, classesRes, notiRes] = await Promise.all([
      axiosInstance.get("/admin/students"),
      axiosInstance.get("/admin/classes"),
      axiosInstance.get("/admin/notifications/get"),
    ]);
    setAllParents(parentsRes.data.students || []);
    setAllClasses(classesRes.data.classes || []);
    setNotifications(notiRes.data.notifications || []);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecipientToggle = (field) => {
    setForm({
      ...form,
      recipients: {
        ...form.recipients,
        [field]: !form.recipients[field],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/notifications/send", form);
      alert("Notification sent");
      setForm({
        title: "",
        message: "",
        type: "general",
        recipients: {
          allParents: false,
          allTeachers: false,
          specificParents: [],
          classIds: [],
        },
      });
      fetchInitialData();
    } catch (err) {
      alert("Failed to send");
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
            Admin Notifications
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Send notifications to parents and teachers
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
                Send Notification
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter notification title"
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
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter your message here..."
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

              {/* Recipients Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recipients</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.recipients.allParents}
                        onChange={() => handleRecipientToggle("allParents")}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          All Parents
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          Send to all parents
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.recipients.allTeachers}
                        onChange={() => handleRecipientToggle("allTeachers")}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          All Teachers
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          Send to all teachers
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Parents
                  </label>
                  <select
                    multiple
                    value={form.recipients.specificParents}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setForm({
                        ...form,
                        recipients: { ...form.recipients, specificParents: values },
                      });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base min-h-[120px]"
                  >
                    {allParents.map((parent) => (
                      <option key={parent._id} value={parent._id} className="py-2">
                        {parent.personalInfo?.name} ({parent.personalInfo?.email})
                      </option>
                    ))}
                  </select>
                  {/* <p className="text-xs text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple parents
                  </p> */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class-wise
                  </label>
                  <select
                    multiple
                    value={form.recipients.classIds}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setForm({
                        ...form,
                        recipients: { ...form.recipients, classIds: values },
                      });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base min-h-[120px]"
                  >
                    {allClasses.map((cls) => (
                      <option key={cls._id} value={cls._id} className="py-2">
                        {cls.name}
                      </option>
                    ))}
                  </select>
               
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm lg:text-base"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
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
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base flex-1 min-w-0 pr-2">
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
                    <p className="text-gray-700 text-xs lg:text-sm leading-relaxed mb-3">
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
                        Sent on {new Date(n.createdAt).toLocaleString()}
                      </span>
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

export default AdminNotifications;
