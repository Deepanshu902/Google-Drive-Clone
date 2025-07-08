import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage } from "../services/authService";
import { login, setStorage, logout } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

const Dashboard = () => {
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
        
        // Only fetch user data if not already in Redux
        if (!userData) {
          const userResponse = await getCurrentUser();
          if (userResponse.data) {
            dispatch(login(userResponse.data));
          }
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Only fetch storage if not already in Redux
        if (!storage) {
          const storageResponse = await getStorage();
          if (storageResponse.data) {
            dispatch(setStorage(storageResponse.data));
          }
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Always fetch files but with delay
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
  }, [dispatch]); // Remove userData and storage from dependencies to avoid loops

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
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
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-4xl font-bold text-blue-500 mb-6"
      >
        Cloud Drive Dashboard
      </motion.h1>

      <button 
        onClick={handleLogout} 
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white self-end mb-4" >
          Logout
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, delay: 0.3 }} 
        className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl text-center"
      >
        {userData ? (
          <>
            <h2 className="text-2xl font-semibold">Welcome, {userData.name}!</h2>
            <p className="text-gray-400 mt-2">{userData.email}</p>
          </>
        ) : (
          <p className="text-gray-400">Loading user data...</p>
        )}
      </motion.div>

      {storage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.5 }} 
          className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl mt-6 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-300">Storage Usage</h2>
          <p className="text-gray-400 mt-2">
            <span className="font-bold text-blue-400">{usedStorageGB} GB</span> / <span className="text-gray-400">{totalStorageGB} GB</span>
          </p>
          <div className="mt-4 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div className="bg-blue-500 h-4" style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.7 }} 
        className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl mt-6"
      >
        <h2 className="text-xl font-semibold text-gray-300 text-center">Upload Files</h2>
        <FileUpload />
      </motion.div>

      <FileList />
    </div>
  );
};

export default Dashboard;