import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
  currentFolderId: null, // null means root directory
  folderPath: [], // Breadcrumb trail
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = Array.isArray(action.payload) ? action.payload : [];
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    updateFolder: (state, action) => {
      const index = state.folders.findIndex(f => f._id === action.payload._id);
      if (index !== -1) {
        state.folders[index] = action.payload;
      }
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter(f => f._id !== action.payload);
    },
    setCurrentFolder: (state, action) => {
      state.currentFolderId = action.payload;
    },
    setFolderPath: (state, action) => {
      state.folderPath = action.payload;
    },
    navigateToFolder: (state, action) => {
      const { folderId, folderName } = action.payload;
      state.currentFolderId = folderId;
      
      // Update breadcrumb path
      if (folderId === null) {
        // Root directory
        state.folderPath = [];
      } else {
        // Add to path if not already there
        const existingIndex = state.folderPath.findIndex(p => p.id === folderId);
        if (existingIndex !== -1) {
          // Going back - trim path
          state.folderPath = state.folderPath.slice(0, existingIndex + 1);
        } else {
          // Going forward - add to path
          state.folderPath.push({ id: folderId, name: folderName });
        }
      }
    },
    goToRoot: (state) => {
      state.currentFolderId = null;
      state.folderPath = [];
    },
  },
});

export const { 
  setFolders, 
  addFolder, 
  updateFolder, 
  removeFolder, 
  setCurrentFolder,
  setFolderPath,
  navigateToFolder,
  goToRoot,
} = folderSlice.actions;

export default folderSlice.reducer;