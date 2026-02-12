import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { deleteFolder, renameFolder } from "../services/folderService";
import { removeFolder, navigateToFolder, updateFolder } from "../store/folderSlice";
import ShareModal from "./ShareModal";

const FolderItem = ({ folder }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.folderName);
  const [showActions, setShowActions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleOpenFolder = () => {
    if (!isRenaming) {
      dispatch(navigateToFolder({ folderId: folder._id, folderName: folder.folderName }));
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === folder.folderName) {
      setIsRenaming(false);
      setNewName(folder.folderName);
      return;
    }

    try {
      const updated = await renameFolder(folder._id, newName.trim());
      dispatch(updateFolder(updated));
      setIsRenaming(false);
    } catch (error) {
      console.error("Rename failed:", error);
      setNewName(folder.folderName);
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${folder.folderName}" and all its contents?`)) return;

    try {
      setIsDeleting(true);
      await deleteFolder(folder._id);
      dispatch(removeFolder(folder._id));
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
        className={`group relative bg-white hover:bg-slate-50 border border-black/5 rounded-xl p-4 transition-all duration-200 ${
          isDeleting ? "pointer-events-none" : ""
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-4">
          {/* Folder Icon */}
          <div
            onClick={handleOpenFolder}
            className="flex-shrink-0 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>

          {/* Folder Name */}
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsRenaming(false);
                    setNewName(folder.folderName);
                  }
                }}
                autoFocus
                className="w-full px-2 py-1 text-[15px] font-medium text-black border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <h3
                onClick={handleOpenFolder}
                className="text-[15px] font-medium text-black truncate cursor-pointer hover:text-blue-600 transition-colors"
              >
                {folder.folderName}
              </h3>
            )}
            <p className="text-[13px] text-black/50 mt-0.5">
              Folder
            </p>
          </div>

          {/* Actions */}
          {showActions && !isRenaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-black/40 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                title="Share"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Rename Button */}
              <button
                onClick={() => setIsRenaming(true)}
                className="p-2 text-black/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Rename"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                title="Delete"
              >
                {isDeleting ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        resource={folder}
        resourceType="Folder"
      />
    </>
  );
};

export default FolderItem;