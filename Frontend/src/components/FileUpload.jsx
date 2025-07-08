// src/components/FileUpload.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { uploadFile } from "../services/fileService";
import { addFile } from "../store/fileSlice";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    setUploadMessage("Please select a file.");
    return;
  }

  try {
    const uploadedFile = await uploadFile(selectedFile);
    dispatch(addFile(uploadedFile)); // Remove .data here
    setUploadMessage("File uploaded successfully!");
    setSelectedFile(null); // Clear the file input
  } catch (error) {
    setUploadMessage("File upload failed.");
  }
};

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-md text-white text-center">
      <input type="file" onChange={handleFileChange} className="mb-3 p-2 w-full bg-gray-800 border border-gray-700 text-white rounded" />
      <motion.button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:bg-blue-500"
        whileHover={{ scale: 1.05 }}
      >
        Upload File
      </motion.button>
      {uploadMessage && <p className="mt-2 text-gray-400">{uploadMessage}</p>}
    </div>
  );
};

export default FileUpload;
