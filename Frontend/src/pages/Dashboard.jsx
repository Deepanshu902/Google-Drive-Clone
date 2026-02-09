import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getStorage, logoutUser } from "../services/authService";
import { login, setStorage, logout } from "../store/authSlice";
import { getFiles } from "../services/fileService";
import { getFolders } from "../services/folderService";
import { setFiles } from "../store/fileSlice";
import { setFolders } from "../store/folderSlice";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";
import FolderItem from "../components/FolderItem";
import CreateFolderModal from "../components/CreateFolderModal";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, storage } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);
  const { folders, currentFolderId } = useSelector((state) => state.folder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);

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
        
        // Fetch files and folders
        const [filesResponse, foldersResponse] = await Promise.all([
          getFiles(),
          getFolders()
        ]);
        
        dispatch(setFiles(filesResponse));
        dispatch(setFolders(foldersResponse));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  // Filter folders and files for current directory
  const currentFolders = folders.filter(
    folder => (folder.parentFolderId || null) === currentFolderId && !folder.isDeleted
  );
  
  const currentFiles = files.filter(
    file => (file.folderId || null) === currentFolderId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[14px] text-black/60">Loading your files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-[17px] text-black/80 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  const totalStorageGB = storage?.totalStorage ? (parseInt(storage.totalStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usedStorageGB = storage?.usedStorage ? (parseInt(storage.usedStorage) / (1024 ** 3)).toFixed(2) : 0;
  const usagePercentage = totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;

  return (
    <div className="min-h-screen bg-white antialiased">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-black -tracking-[0.022em]">
              Cloud Drive
            </span>
          </div>

          {/* User Info & Logout */}
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
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column - Folders & Files */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Breadcrumb & New Folder Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between"
            >
              <Breadcrumb />
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-xl text-[14px] font-medium text-black hover:bg-slate-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Folder
              </button>
            </motion.div>

            {/* Folders Section */}
            {currentFolders.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-[17px] font-semibold text-black mb-3">
                  Folders
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentFolders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Upload Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="mb-4">
                <h2 className="text-[28px] font-semibold text-black -tracking-[0.015em]">
                  Upload files
                </h2>
                <p className="text-[14px] text-black/60 mt-1">
                  {currentFolderId ? "Upload to current folder" : "Add new files to your storage"}
                </p>
              </div>
              <FileUpload />
            </motion.section>

            {/* Files Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="mb-4">
                <h2 className="text-[28px] font-semibold text-black -tracking-[0.015em]">
                  Files
                </h2>
                <p className="text-[14px] text-black/60 mt-1">
                  {currentFiles.length} {currentFiles.length === 1 ? 'file' : 'files'}
                </p>
              </div>
              <FileList />
            </motion.section>
          </div>

          {/* Sidebar - Storage Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="sticky top-24 bg-slate-50 rounded-2xl border border-black/5 p-6"
            >
              <h3 className="text-[17px] font-semibold text-black mb-6 -tracking-[0.022em]">
                Storage
              </h3>

              {storage && (
                <div className="space-y-6">
                  {/* Storage Amount */}
                  <div className="text-center">
                    <div className="text-[48px] font-semibold text-black -tracking-[0.015em] leading-none">
                      {usedStorageGB}
                      <span className="text-[21px] text-black/40 font-normal"> GB</span>
                    </div>
                    <div className="text-[13px] text-black/60 mt-2">
                      of {totalStorageGB} GB used
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-black/50">
                      <span>{usagePercentage.toFixed(1)}% used</span>
                      <span>{(totalStorageGB - usedStorageGB).toFixed(2)} GB free</span>
                    </div>
                  </div>

                  {/* Storage Warning */}
                  {usagePercentage > 80 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-[13px] text-orange-900 font-medium">
                        Storage almost full
                      </p>
                      <p className="text-[12px] text-orange-700 mt-1">
                        Consider deleting unused files or upgrading your plan
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>

      {/* Create Folder Modal */}
      <CreateFolderModal 
        isOpen={showCreateFolder} 
        onClose={() => setShowCreateFolder(false)} 
      />
    </div>
  );
};

export default Dashboard;