// src/components/FileItem.jsx
import { useDispatch } from "react-redux";
import { deleteFile } from "../services/fileService";
import { removeFile } from "../store/fileSlice";
import { useAnimation } from "motion/react";

// Import your new animated icon components
import AnimatedDownloadIcon from "./AnimatedDownloadIcon";
import AnimatedDeleteIcon from "./AnimatedDeleteIcon";


const FileItem = ({ file }) => {
  const dispatch = useDispatch();

  // Create separate animation controls for each button
  const downloadControls = useAnimation();
  const deleteControls = useAnimation();

  const handleDownload = async () => {
    try {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file._id);
      dispatch(removeFile(file._id));
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <li className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mt-2 transition-all hover:bg-gray-700/50">
      <div className="flex items-center gap-4">
        {file.contentType && file.contentType.startsWith("image/") ? (
          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" title="View image in new tab">
            <img src={file.fileUrl} alt={file.filename} className="w-12 h-12 rounded-lg object-cover" />
          </a>
        ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
        )}
        <span className="font-medium text-white">
            {file.filename || "Unnamed File"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* --- ANIMATED DOWNLOAD BUTTON --- */}
        <button
          onClick={handleDownload}
          className="p-2 rounded-full text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
          aria-label="Download file"
          title="Download"
          onMouseEnter={() => downloadControls.start("animate")}
          onMouseLeave={() => downloadControls.start("normal")}
        >
          <AnimatedDownloadIcon animate={downloadControls} />
        </button>

        {/* --- ANIMATED DELETE BUTTON --- */}
        <button
            onClick={handleDelete}
            className="p-2 rounded-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Delete file"
            title="Delete"
            onMouseEnter={() => deleteControls.start("animate")}
            onMouseLeave={() => deleteControls.start("normal")}
        >
          <AnimatedDeleteIcon animate={deleteControls} />
        </button>
      </div>
    </li>
  );
};

export default FileItem;