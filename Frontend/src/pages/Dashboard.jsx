import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage } from "../services/authService";
import { login, setStorage } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userData, storage } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await getCurrentUser();
        dispatch(login(userResponse.data));
  
        const storageResponse = await getStorage();
        dispatch(setStorage(storageResponse.data));
  
        const filesResponse = await getFiles(); // ✅ Fetch user files
        console.log("Files received before dispatch:", filesResponse); // ✅ Debug log
  
        dispatch(setFiles(filesResponse)); // ✅ Ensure correct data is sent to Redux
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    }
    fetchData();
  }, [dispatch]);

  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl font-bold text-blue-500 mb-6">
        Cloud Drive Dashboard
      </motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-300">Storage Usage</h2>
          <p className="text-gray-400 mt-2">
            <span className="font-bold text-blue-400">{usedStorageGB} GB</span> / <span className="text-gray-400">{totalStorageGB} GB</span>
          </p>
          <div className="mt-4 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div className="bg-blue-500 h-4" style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl mt-6">
        <h2 className="text-xl font-semibold text-gray-300 text-center">Upload Files</h2>
        <FileUpload />
      </motion.div>

      <FileList />
    </div>
  );
};

export default Dashboard;
