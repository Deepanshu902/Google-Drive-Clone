import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage } from "../services/authService";
import { login, setStorage, logout } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import { useNavigate } from "react-router-dom";

// SVG Icon for a better visual touch
const UploadCloudIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
  </svg>
);

const Dashboard = () => {
  // --- All of your original logic remains unchanged ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, storage } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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

  // --- Loading and Error states are unchanged ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // --- Storage calculations are unchanged ---
  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  // --- THIS IS THE ONLY PART THAT HAS CHANGED: THE UI ---
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Modern Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10"
      >
        <h1 className="text-2xl font-bold text-blue-500">Cloud Drive</h1>
        <div className="flex items-center gap-4">
          {userData && (
            <div className="text-right hidden sm:block">
              <p className="font-semibold">Welcome, {userData.name}!</p>
              <p className="text-sm text-slate-400">{userData.email}</p>
            </div>
          )}
          <button onClick={handleLogout} className="bg-slate-700 hover:bg-red-600 transition-colors text-white font-bold py-2 px-4 rounded-lg">
            Logout
          </button>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: File Upload and File List */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Upload New Files</h2>
              {/* Your FileUpload component is placed here */}
              <FileUpload />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl"
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Your Files</h2>
              </div>
              <div className="p-6">
                {/* Your FileList component is placed here */}
                <FileList />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Storage Status */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-4">Storage</h2>
              {storage && (
                <>
                  <p className="text-center text-slate-300 mt-4 text-2xl">
                    <span className="font-bold text-blue-400">{usedStorageGB} GB</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-slate-400">{totalStorageGB} GB</span>
                  </p>
                  <div className="mt-4 w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;