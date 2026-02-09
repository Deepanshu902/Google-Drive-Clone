import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new folder
const createFolder = async (folderName, parentFolderId = null) => {
  const response = await axios.post(
    `${API_URL}folder/createFolder`,
    { folderName, parentFolderId },
    { withCredentials: true }
  );
  return response.data?.data;
};

// Get all folders
const getFolders = async () => {
  try {
    const response = await axios.get(`${API_URL}folder/list`, { 
      withCredentials: true 
    });
    const folders = response.data?.data;
    
    if (Array.isArray(folders)) return folders;
    return [];
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

// Rename a folder
const renameFolder = async (folderId, newName) => {
  const response = await axios.patch(
    `${API_URL}folder/${folderId}/rename`,
    { newName },
    { withCredentials: true }
  );
  return response.data?.data;
};

// Delete a folder
const deleteFolder = async (folderId) => {
  const response = await axios.delete(
    `${API_URL}folder/${folderId}`,
    { withCredentials: true }
  );
  return response.data;
};

export { createFolder, getFolders, renameFolder, deleteFolder };