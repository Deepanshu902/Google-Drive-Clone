import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage, logoutUser } from "../services/authService";
import { login, setStorage, logout } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import { useNavigate } from "react-router-dom";

// Icons
const CloudIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
     <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);

const StorageIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, storage } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        if (!userData) {
          const userResponse = await getCurrentUser();
          if (userResponse.data) {
            dispatch(login(userResponse.data));
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if (!storage) {
          const storageResponse = await getStorage();
          if (storageResponse.data) {
            dispatch(setStorage(storageResponse.data));
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        const filesResponse = await getFiles();
        dispatch(setFiles(filesResponse));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CloudIcon />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Cloud Drive
              </h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              {userData && (
                <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userData.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 text-sm">{userData.name}</p>
                    <p className="text-xs text-slate-500">{userData.email}</p>
                  </div>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Column - Files & Upload */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Upload Files</h2>
                <p className="text-sm text-slate-500 mt-1">Add new files to your cloud storage</p>
              </div>
              <div className="p-6">
                <FileUpload />
              </div>
            </motion.div>

            {/* Files Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">My Files</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your uploaded files</p>
              </div>
              <div className="p-6">
                <FileList />
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Storage Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <StorageIcon />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Storage</h3>
              </div>

              {storage && (
                <div className="space-y-4">
                  {/* Storage Stats */}
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-slate-800">
                      {usedStorageGB}
                      <span className="text-lg text-slate-400 font-normal"> GB</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      of {totalStorageGB} GB used
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{usagePercentage.toFixed(1)}% used</span>
                      <span>{(totalStorageGB - usedStorageGB).toFixed(2)} GB free</span>
                    </div>
                  </div>

                  {/* Storage Warning */}
                  {usagePercentage > 80 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-amber-800 font-medium">
                        ⚠️ Storage almost full
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Consider deleting unused files
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;