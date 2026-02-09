import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Upload a file
const uploadFile = async (fileData, folderId = null) => {
    const formData = new FormData();
    formData.append("file", fileData, fileData.name);
    
    // Add folderId if provided
    if (folderId) {
        formData.append("folderId", folderId);
    }

    const response = await axios.post(`${API_URL}file/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.data;
};

// Get all files
const getFiles = async () => {
  try {
    const response = await axios.get(`${API_URL}file`, { withCredentials: true });
    const files = response.data?.data;

    // Safely return array or empty array
    if (Array.isArray(files)) return files;
    
    // If backend returns { message: "No files found" }
    return [];
  } catch (error) {
    console.error("Error fetching files:", error);
    return []; // return empty array if request fails
  }
};

// Delete a file
const deleteFile = async (fileId) => {
    const response = await axios.delete(`${API_URL}file/${fileId}`, { withCredentials: true });
    return response.data;
};

export { uploadFile, getFiles, deleteFile };
