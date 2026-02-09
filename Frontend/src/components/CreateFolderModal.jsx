import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createFolder } from "../services/folderService";
import { addFolder } from "../store/folderSlice";

const CreateFolderModal = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { currentFolderId } = useSelector((state) => state.folder);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      const newFolder = await createFolder(folderName.trim(), currentFolderId);
      dispatch(addFolder(newFolder));
      setFolderName("");
      onClose();
    } catch (err) {
      console.error("Create folder error:", err);
      setError(err.response?.data?.message || "Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFolderName("");
      setError("");
      onClose();
    }
  };

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
                  New Folder
                </h2>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-[14px] font-medium text-black/80 mb-2">
                    Folder name
                  </label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Untitled folder"
                    autoFocus
                    disabled={isCreating}
                    className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  {error && (
                    <p className="mt-2 text-[13px] text-red-600">{error}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isCreating}
                    className="px-5 py-2.5 text-[14px] font-medium text-black/60 hover:text-black disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !folderName.trim()}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;