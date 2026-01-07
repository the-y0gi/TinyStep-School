import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
import { toast } from "react-hot-toast";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/teacher/profile");
      setProfile(res.data.data);
      setForm({
        name: res.data.data.personalInfo.name,
        phone: res.data.data.personalInfo.phone,
        address: res.data.data.personalInfo.address || "",
        qualifications: res.data.data.teacherDetails.qualifications || "",
        profileImage: res.data.data.personalInfo.profileImage || "",
      });
    } catch (err) {
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await axiosInstance.put("/teacher/profile/update", form);
      toast.success("Profile updated");
      fetchProfile();
      setShowProfileModal(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
    if (newPassword !== confirmNewPassword)
      return toast.error("Passwords do not match");
    try {
      await axiosInstance.put("/teacher/profile/change-password", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success("Password changed");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowPasswordModal(false);
    } catch {
      toast.error("Failed to change password");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Teacher Profile
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-black to-indigo-400 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={profile.personalInfo.profileImage || "/placeholder.png"}
                  alt="profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="text-center sm:text-left text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {profile.personalInfo.name}
                </h2>
                <p className="text-blue-100 text-lg mb-1">{profile.email}</p>
                <p className="text-blue-200">Teacher</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Phone Number
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {profile.personalInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="text-gray-800 font-semibold">
                      {profile.personalInfo.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Qualifications
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {profile.teacherDetails.qualifications || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Role</p>
                    <p className="text-gray-800 font-semibold">Teacher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Update Profile
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualifications
                </label>
                <input
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.qualifications}
                  onChange={(e) =>
                    setForm({ ...form, qualifications: e.target.value })
                  }
                  placeholder="Enter your qualifications"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.profileImage}
                  onChange={(e) =>
                    setForm({ ...form, profileImage: e.target.value })
                  }
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Change Password
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-gray-500 focus:outline-none transition-colors"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-gray-500 focus:outline-none transition-colors"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-gray-500 focus:outline-none transition-colors"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../services/axiosConfig";
// import { toast } from "react-hot-toast";

// const TeacherProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState({});
//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const res = await axiosInstance.get("/teacher/profile");
//       setProfile(res.data.data);
//       setForm({
//         name: res.data.data.personalInfo.name,
//         phone: res.data.data.personalInfo.phone,
//         address: res.data.data.personalInfo.address || "",
//         qualifications: res.data.data.teacherDetails.qualifications || "",
//         profileImage: res.data.data.personalInfo.profileImage || "",
//       });
//     } catch (err) {
//       toast.error("Failed to fetch profile");
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleUpdate = async () => {
//     try {
//       await axiosInstance.put("/teacher/profile/update", form);
//       toast.success("Profile updated");
//       fetchProfile();
//       setShowProfileModal(false);
//     } catch {
//       toast.error("Failed to update profile");
//     }
//   };

//   const handlePasswordChange = async () => {
//     const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
//     if (newPassword !== confirmNewPassword) return toast.error("Passwords do not match");
//     try {
//       await axiosInstance.put("/teacher/profile/change-password", {
//         oldPassword,
//         newPassword,
//         confirmNewPassword,
//       });
//       toast.success("Password changed");
//       setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
//       setShowPasswordModal(false);
//     } catch {
//       toast.error("Failed to change password");
//     }
//   };

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Profile</h1>
//           <p className="text-gray-600">Manage your profile information</p>
//         </div>

//         {/* Main Profile Card */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200">
//           {/* Profile Header */}
//           <div className="p-8 border-b border-gray-200">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               <div>
//                 <img
//                   src={profile.personalInfo.profileImage || "/placeholder.png"}
//                   alt="profile"
//                   className="w-24 h-24 rounded-full object-cover border-3 border-gray-300"
//                 />
//               </div>
//               <div className="text-center md:text-left">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.personalInfo.name}</h2>
//                 <p className="text-gray-600 mb-2">{profile.email}</p>
//                 <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
//                   Teacher
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Profile Details */}
//           <div className="p-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
//                     </svg>
//                     <span className="text-sm text-gray-500 font-medium">Phone Number</span>
//                   </div>
//                   <p className="text-gray-900 font-medium">{profile.personalInfo.phone}</p>
//                 </div>

//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                     </svg>
//                     <span className="text-sm text-gray-500 font-medium">Address</span>
//                   </div>
//                   <p className="text-gray-900 font-medium">{profile.personalInfo.address || "Not provided"}</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
//                     </svg>
//                     <span className="text-sm text-gray-500 font-medium">Qualifications</span>
//                   </div>
//                   <p className="text-gray-900 font-medium">{profile.teacherDetails.qualifications || "Not provided"}</p>
//                 </div>

//                 <div className="p-4 border border-gray-200 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                     </svg>
//                     <span className="text-sm text-gray-500 font-medium">Role</span>
//                   </div>
//                   <p className="text-gray-900 font-medium">Teacher</p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowProfileModal(true)}
//                 className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
//               >
//                 <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//                 </svg>
//                 Edit Profile
//               </button>
//               <button
//                 onClick={() => setShowPasswordModal(true)}
//                 className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                 </svg>
//                 Change Password
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {showProfileModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
//             </div>
//             <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                 <input
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="Enter your name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                 <input
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={form.phone}
//                   onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                   placeholder="Enter phone number"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 <input
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   placeholder="Enter your address"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
//                 <input
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={form.qualifications}
//                   onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
//                   placeholder="Enter your qualifications"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
//                 <input
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={form.profileImage}
//                   onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
//                   placeholder="Enter image URL"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowProfileModal(false)}
//                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Change Password Modal */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
//             <div className="p-6 border-b border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
//             </div>
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
//                 <input
//                   type="password"
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={passwordForm.oldPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
//                   placeholder="Enter current password"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                 <input
//                   type="password"
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                   placeholder="Enter new password"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//                 <input
//                   type="password"
//                   className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
//                   value={passwordForm.confirmNewPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
//                   placeholder="Confirm new password"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowPasswordModal(false)}
//                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePasswordChange}
//                 className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
//               >
//                 Update Password
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherProfile;
