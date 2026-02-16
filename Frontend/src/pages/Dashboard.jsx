import { useEffect, useState } from "react";
import { motion} from "framer-motion";
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
  
  // UI State
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  const currentFolders = folders.filter(
    folder => (folder.parentFolderId || null) === currentFolderId && !folder.isDeleted
  );
  
  const currentFiles = files.filter(
    file => (file.folderId || null) === currentFolderId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Refresh</button>
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
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5">
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

          {/* User Info & Logout (RESTORED ORIGINAL DESIGN) */}
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

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Action Bar: Breadcrumbs + NEW BUTTONS */}
            <div className="flex items-center justify-between">
              <Breadcrumb />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateFolder(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                  New Folder
                </button>
                
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload File
                </button>
              </div>
            </div>

            {/* Folders Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Folders</h2>
              {currentFolders.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentFolders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No folders in this directory</p>
              )}
            </div>

            {/* Files Section */}
            <div>
               <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Files</h2>
               <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <FileList /> 
               </div>
            </div>
          </div>

          {/* Right Sidebar - Storage */}
          <div className="lg:col-span-1">
             <div className="sticky top-24">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                   <h3 className="font-semibold text-gray-900 mb-4">Storage Details</h3>
                   <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            {usagePercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {usedStorageGB} / {totalStorageGB} GB
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div style={{ width: `${usagePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                   </div>
                   <p className="text-xs text-gray-500 mt-4">
                      Upgrade your plan to get more storage space for your projects.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* MODALS */}
      <CreateFolderModal 
        isOpen={showCreateFolder} 
        onClose={() => setShowCreateFolder(false)} 
      />

     
    
      {showUploadModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Upload Files</h3>
                <button 
                  onClick={() => setShowUploadModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <FileUpload onUploadComplete={() => setShowUploadModal(false)} />
              </div>
            </div>
          </div>
        </>
      )}
     

    </div>
  );
};

export default Dashboard;