import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { moveFile } from "../services/fileService";
import { updateFile } from "../store/fileSlice";

const MoveFileModal = ({ isOpen, onClose, file }) => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folder);

  // Get all folders (excluding deleted ones)
  const availableFolders = folders.filter(f => !f.isDeleted);

  const handleMove = async () => {
    try {
      setIsMoving(true);
      setError("");
      
      const updatedFile = await moveFile(file._id, selectedFolderId);
      
      // Update file in Redux
      dispatch(updateFile(updatedFile));
      
      onClose();
    } catch (err) {
      console.error("Move file error:", err);
      setError(err.response?.data?.message || "Failed to move file");
    } finally {
      setIsMoving(false);
    }
  };

  const handleClose = () => {
    if (!isMoving) {
      setSelectedFolderId(null);
      setError("");
      onClose();
    }
  };

  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-black/5">
                <h2 className="text-[17px] font-semibold text-black">
                  Move "{file.filename}"
                </h2>
                <p className="text-[13px] text-black/50 mt-1">
                  Select destination folder
                </p>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[400px] overflow-y-auto">
                {/* Root Option */}
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all ${
                    selectedFolderId === null
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-medium text-black">My Drive</p>
                    <p className="text-[12px] text-black/50">Root folder</p>
                  </div>
                  {selectedFolderId === null && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Folder Options */}
                {availableFolders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[14px] text-black/50">No folders available</p>
                  </div>
                ) : (
                  availableFolders.map((folder) => (
                    <button
                      key={folder._id}
                      onClick={() => setSelectedFolderId(folder._id)}
                      disabled={file.folderId === folder._id}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all ${
                        selectedFolderId === folder._id
                          ? "bg-blue-50 border-2 border-blue-500"
                          : file.folderId === folder._id
                          ? "bg-slate-50 border-2 border-transparent opacity-50 cursor-not-allowed"
                          : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-medium text-black">{folder.folderName}</p>
                        {file.folderId === folder._id && (
                          <p className="text-[12px] text-black/50">Current location</p>
                        )}
                      </div>
                      {selectedFolderId === folder._id && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))
                )}

                {error && (
                  <p className="mt-4 text-[13px] text-red-600 text-center">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-black/5 flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  disabled={isMoving}
                  className="px-5 py-2.5 text-[14px] font-medium text-black/60 hover:text-black disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMove}
                  disabled={isMoving || selectedFolderId === file.folderId}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isMoving ? "Moving..." : "Move here"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoveFileModal;