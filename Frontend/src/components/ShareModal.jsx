import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchUserByEmail } from "../services/userService";
import { shareResource, getUsersWithAccess, removeAccess, updateAccess } from "../services/shareService";

const ShareModal = ({ isOpen, onClose, resource, resourceType }) => {
  const [email, setEmail] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sharedAccessId, setSharedAccessId] = useState(null);

  // Load users with access when modal opens
  useEffect(() => {
    if (isOpen && resource) {
      loadSharedUsers();
    }
  }, [isOpen, resource]);

  const loadSharedUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await getUsersWithAccess(resource._id);
      
      // Backend returns array directly, format it
      if (Array.isArray(users) && users.length > 0) {
        // If it's the sharedWith array from backend
        const formattedUsers = users.map(user => ({
          userId: user.userId,
          accessType: user.accessType
        }));
        setSharedUsers(formattedUsers);
      } else {
        setSharedUsers([]);
      }
    } catch (err) {
      console.error("Error loading shared users:", err);
      setSharedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSearchUser = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setFoundUser(null);
      
      const user = await searchUserByEmail(email.trim());
      setFoundUser(user);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "User not found");
      setFoundUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async () => {
    if (!foundUser) return;

    try {
      setIsSharing(true);
      setError("");
      
      const result = await shareResource(resource._id, resourceType, foundUser._id, accessType);
      
      // Store the sharedAccess ID for future updates
      if (result && result._id) {
        setSharedAccessId(result._id);
      }
      
      // Reload shared users
      await loadSharedUsers();
      
      // Reset form
      setEmail("");
      setFoundUser(null);
      setAccessType("view");
    } catch (err) {
      console.error("Share error:", err);
      setError(err.response?.data?.message || "Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveAccess = async (userId) => {
    if (!window.confirm("Remove access for this user?")) return;

    try {
      // Need to get the sharedAccess document ID first
      await removeAccess(resource._id, userId);
      await loadSharedUsers();
    } catch (err) {
      console.error("Remove access error:", err);
      setError("Failed to remove access");
    }
  };

  const handleUpdateAccess = async (userId, newAccessType) => {
    try {
      await updateAccess(resource._id, userId, newAccessType);
      await loadSharedUsers();
    } catch (err) {
      console.error("Update access error:", err);
      setError("Failed to update access");
    }
  };

  const handleClose = () => {
    setEmail("");
    setFoundUser(null);
    setAccessType("view");
    setError("");
    setSharedUsers([]);
    onClose();
  };

  if (!resource) return null;

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-black/5">
                <h2 className="text-[17px] font-semibold text-black">
                  Share "{resource.filename || resource.folderName}"
                </h2>
                <p className="text-[13px] text-black/50 mt-1">
                  Grant access to other users
                </p>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                
                {/* Add People Section */}
                <div className="mb-6">
                  <label className="block text-[14px] font-medium text-black/80 mb-2">
                    Add people
                  </label>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2.5 bg-white border border-black/10 rounded-xl text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={handleSearchUser}
                      disabled={isSearching}
                      className="px-4 py-2.5 bg-slate-100 text-black/80 rounded-xl text-[14px] font-medium hover:bg-slate-200 disabled:opacity-50 transition-all"
                    >
                      {isSearching ? "..." : "Find"}
                    </button>
                  </div>

                  {/* Found User */}
                  {foundUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-50 rounded-xl mb-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-[13px]">
                            {foundUser.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-black">{foundUser.name}</p>
                            <p className="text-[12px] text-black/50">{foundUser.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={accessType}
                            onChange={(e) => setAccessType(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-black/10 rounded-lg text-[13px] focus:outline-none focus:border-blue-500"
                          >
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                          </select>
                          
                          <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
                          >
                            {isSharing ? "Sharing..." : "Share"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <p className="text-[13px] text-red-600">{error}</p>
                  )}
                </div>

                {/* People with access */}
                <div>
                  <h3 className="text-[14px] font-semibold text-black mb-3">
                    People with access
                  </h3>
                  
                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                    </div>
                  ) : sharedUsers.length === 0 ? (
                    <p className="text-[13px] text-black/50 text-center py-4">
                      No one else has access yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {sharedUsers.map((access) => (
                        <div
                          key={access.userId._id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-[12px]">
                              {access.userId.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-black">{access.userId.name}</p>
                              <p className="text-[11px] text-black/50">{access.userId.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <select
                              value={access.accessType}
                              onChange={(e) => handleUpdateAccess(access.userId._id, e.target.value)}
                              className="px-2 py-1 bg-white border border-black/10 rounded-lg text-[12px] focus:outline-none focus:border-blue-500"
                            >
                              <option value="view">View</option>
                              <option value="edit">Edit</option>
                            </select>
                            
                            <button
                              onClick={() => handleRemoveAccess(access.userId._id)}
                              className="p-1.5 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove access"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-black/5 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-slate-100 text-black/80 rounded-xl text-[14px] font-medium hover:bg-slate-200 transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;