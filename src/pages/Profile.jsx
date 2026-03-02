import React, { useState, useRef, useEffect } from "react"; // ✨ useEffect imported
import { FiUser, FiMail, FiPhone, FiSave, FiCamera, FiEdit2, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
  // ✨ Real data ke liye state ko empty/initial setup karein
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "https://api.dicebear.com/8.x/adventurer/svg?seed=default", // Default Avatar
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(profileData);
  const fileInputRef = useRef(null);

  // ✨ LOCAL STORAGE SE DATA FETCH KAREIN
  useEffect(() => {
    // Man lein ki signup ke waqt aapne localStorage mein data save kiya hai
    const storedName = localStorage.getItem("userName") || "User";
    const storedEmail = localStorage.getItem("userEmail") || "user@example.com";
    const storedPhone = localStorage.getItem("userPhone") || "Not Provided";
    const storedAvatar = localStorage.getItem("userAvatar") || profileData.avatar;

    const realData = {
        name: storedName,
        email: storedEmail,
        phone: storedPhone,
        avatar: storedAvatar,
    };

    setProfileData(realData);
    setTempData(realData);
  }, []);

  const handleChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfileData(tempData); // Update state

    // ✨ LOCAL STORAGE UPDATE KAREIN
    localStorage.setItem("userName", tempData.name);
    localStorage.setItem("userPhone", tempData.phone);
    localStorage.setItem("userAvatar", tempData.avatar);
    
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  const handleCancel = () => {
    setTempData(profileData); // Revert changes
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your personal information and security.</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="bg-white border border-gray-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition flex items-center gap-2 shadow-sm"
            >
              <FiX size={16} />
              Cancel
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm md:col-span-1 text-center flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={tempData.avatar}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-4 border-indigo-50"
              />
              
              <button 
                onClick={() => isEditing && fileInputRef.current.click()}
                className={`absolute bottom-0 right-0 p-2.5 rounded-full text-white transition ${isEditing ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isEditing}
              >
                <FiCamera size={16} />
              </button>
              
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
            <p className="text-sm text-gray-500">{profileData.email}</p>
            
            <div className="mt-6 w-full text-left space-y-2 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account ID</p>
              <p className="text-sm font-mono bg-gray-50 p-2 rounded-lg text-gray-700">SID-7783992</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Personal Details</h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FiUser />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={tempData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full border rounded-xl py-2.5 pl-10 pr-4 ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-indigo-200" : "border-gray-200 bg-gray-50 cursor-not-allowed"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={tempData.email}
                      disabled={true} // ✨ EMAIL SHOULD NOT BE EDITABLE
                      className="w-full border border-gray-200 bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 cursor-not-allowed text-gray-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FiPhone />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={tempData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full border rounded-xl py-2.5 pl-10 pr-4 ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-indigo-200" : "border-gray-200 bg-gray-50 cursor-not-allowed"}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2"
                  >
                    <FiSave size={18} />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}