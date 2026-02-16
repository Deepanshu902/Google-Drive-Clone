import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/authSlice";
import { logoutUser } from "../services/authService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, storage } = useSelector((state) => state.auth);
  
  // Profile update state
  const [name, setName] = useState(userData?.name || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      setProfileMessage({ type: "", text: "" });
      
      const response = await axios.patch(
        `${API_URL}users/update-account-details`,
        { name: name.trim() },
        { withCredentials: true }
      );
      
      // Update Redux state
      if (response.data?.data) {
        dispatch(login(response.data.data));
      }
      
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      
      setTimeout(() => setProfileMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      setProfileMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update profile" 
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordMessage({ type: "error", text: "All fields are required" });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords don't match" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordMessage({ type: "", text: "" });
      
      await axios.post(
        `${API_URL}users/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        },
        { withCredentials: true }
      );
      
      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      
      setTimeout(() => setPasswordMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password" 
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  return (
    <div className="min-h-screen bg-white antialiased">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-black -tracking-[0.022em]">
              Cloud Drive
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {userData && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-[13px]">
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-medium text-black">{userData.name}</p>
                  <p className="text-[11px] text-black/50">{userData.email}</p>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="text-[13px] font-medium text-black/60 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-6 py-12">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-[32px] font-semibold text-black -tracking-[0.015em]">
              Settings
            </h1>
            <p className="text-[14px] text-black/60 mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Profile Section */}
          <section className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-[20px] font-semibold text-black mb-4">Profile Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-black/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdatingProfile}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-[14px] font-medium text-black/80 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-slate-50 border border-black/10 rounded-xl text-[15px] text-black/50 cursor-not-allowed"
                />
                <p className="text-[12px] text-black/50 mt-1">Email cannot be changed</p>
              </div>

              {profileMessage.text && (
                <div className={`p-3 rounded-xl text-[14px] ${
                  profileMessage.type === "success" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {profileMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </section>

          {/* Change Password Section */}
          <section className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-[20px] font-semibold text-black mb-4">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-black/80 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  disabled={isChangingPassword}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-[14px] font-medium text-black/80 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  disabled={isChangingPassword}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-[14px] font-medium text-black/80 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  disabled={isChangingPassword}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordMessage.text && (
                <div className={`p-3 rounded-xl text-[14px] ${
                  passwordMessage.type === "success" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </section>

          {/* Storage Section */}
          <section className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-[20px] font-semibold text-black mb-4">Storage Usage</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black/60">Used Storage</span>
                <span className="text-[14px] font-medium text-black">{usedStorageGB} GB</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-black/60">Total Storage</span>
                <span className="text-[14px] font-medium text-black">{totalStorageGB} GB</span>
              </div>
              
              <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-[12px] text-black/50">
                {usagePercentage.toFixed(1)}% of your storage is being used
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Settings;