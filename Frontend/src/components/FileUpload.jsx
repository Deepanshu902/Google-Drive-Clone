import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { uploadFile } from "../services/fileService";
import { addFile } from "../store/fileSlice";

const UploadIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadMessage("");
      const uploadedFile = await uploadFile(selectedFile);
      dispatch(addFile(uploadedFile));
      setUploadMessage("✓ File uploaded successfully!");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      setUploadMessage("✗ Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <UploadIcon />
          <p className="mt-4 text-slate-700 font-medium text-center">
            {selectedFile ? (
              <span className="text-blue-600">{selectedFile.name}</span>
            ) : (
              <>
                <span className="text-blue-600 hover:text-blue-700">Click to browse</span> or drag and drop
              </>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {selectedFile ? (
              `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
            ) : (
              "All file types supported"
            )}
          </p>
        </label>
      </div>

      {/* Upload Button */}
      <motion.button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        whileHover={{ scale: selectedFile && !isUploading ? 1.02 : 1 }}
        whileTap={{ scale: selectedFile && !isUploading ? 0.98 : 1 }}
        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
          selectedFile && !isUploading
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload File"
        )}
      </motion.button>

      {/* Upload Message */}
      {uploadMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-medium p-3 rounded-lg ${
            uploadMessage.includes("✓")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {uploadMessage}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;