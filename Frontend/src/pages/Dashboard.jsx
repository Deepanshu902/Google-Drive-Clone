import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage } from "../services/authService";
import { login, setStorage, logout } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import { useNavigate } from "react-router-dom";

// Helper for class names
const classNames = (...classes) => classes.filter(Boolean).join(' ');

// SVG Icon Components (for better readability)
const UploadCloudIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
  </svg>
);

const FileIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const DownloadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, storage } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.files); // Assuming you have a files slice
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Parallelize API calls for faster loading
        const dataPromises = [
          !userData ? getCurrentUser() : Promise.resolve({ data: userData }),
          !storage ? getStorage() : Promise.resolve({ data: storage }),
          getFiles(),
        ];

        const [userResponse, storageResponse, filesResponse] = await Promise.all(dataPromises);
        
        if (userResponse.data) dispatch(login(userResponse.data));
        if (storageResponse.data) dispatch(setStorage(storageResponse.data));
        if (filesResponse) dispatch(setFiles(filesResponse));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch, userData, storage]); // Rerunning if these are null is fine

  // Loading and Error States remain the same...
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

  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  // --- Re-usable components for the new layout ---

  const FileUploader = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-8"
    >
      <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-600 rounded-lg p-10 cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-colors">
        <UploadCloudIcon className="w-12 h-12 text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-white">Drag & drop to upload</h3>
        <p className="text-slate-400">or</p>
        <label htmlFor="file-upload" className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-500 transition-colors">
          Browse Files
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
      </div>
    </motion.div>
  );

  const StorageStatus = () => {
      const circumference = 2 * Math.PI * 50; // 2 * pi * radius
      const strokeDashoffset = circumference - (usagePercentage / 100) * circumference;

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-full flex flex-col justify-center"
        >
            <h2 className="text-xl font-bold text-white text-center mb-4">Storage</h2>
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="10" className="text-slate-700" fill="transparent" />
                    <motion.circle 
                        cx="64" 
                        cy="64" 
                        r="54" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        fill="transparent" 
                        className="text-blue-500"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{usagePercentage.toFixed(0)}%</span>
                    <span className="text-slate-400">used</span>
                </div>
            </div>
            <p className="text-center text-slate-300 mt-4">
                <span className="font-bold text-white">{usedStorageGB} GB</span> of {totalStorageGB} GB
            </p>
        </motion.div>
      )
  };
  
  const FilesTable = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl mt-8"
    >
        <div className="p-6">
            <h2 className="text-xl font-bold text-white">Your Files</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-slate-700 text-sm text-slate-400">
                    <tr>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Size</th>
                        <th className="px-6 py-3 font-medium">Last Modified</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {files && files.length > 0 ? (
                        files.map((file, index) => (
                            <motion.tr 
                                key={file.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="hover:bg-slate-800 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium flex items-center gap-3">
                                    <FileIcon className="w-5 h-5 text-slate-400"/>
                                    {file.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                    {new Date(file.lastModified).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><DownloadIcon className="w-5 h-5"/></button>
                                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-10 text-slate-400">
                                You have no files uploaded.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-4 border-b border-slate-800"
      >
        <h1 className="text-2xl font-bold text-blue-500">Cloud Drive</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{userData?.name}</p>
            <p className="text-sm text-slate-400">{userData?.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-slate-700 hover:bg-red-600 transition-colors text-white font-bold py-2 px-4 rounded-lg">
            Logout
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2">
            <FileUploader />
            <FilesTable />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <StorageStatus />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;