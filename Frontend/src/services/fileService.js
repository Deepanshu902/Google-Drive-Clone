import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Upload a file
const uploadFile = async (fileData) => {
    const formData = new FormData();
    formData.append("file", fileData); 

    const response = await axios.post(`${API_URL}file/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

// Get all files
const getFiles = async () => {
    const response = await axios.get(`${API_URL}file`, { withCredentials: true });
    console.log("Files API Response:", response.data);
    return response.data?.data || [];
};

// Delete a file
const deleteFile = async (fileId) => {
    const response = await axios.delete(`${API_URL}file/${fileId}`, { withCredentials: true });
    return response.data;
};

export { uploadFile, getFiles, deleteFile };
