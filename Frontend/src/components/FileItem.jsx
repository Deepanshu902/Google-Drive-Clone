import { useDispatch } from "react-redux";
import { deleteFile } from "../services/fileService";
import { removeFile } from "../store/fileSlice";

// --- ICONS (for a better UI) ---
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const DeleteIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);


const FileItem = ({ file }) => {
  const dispatch = useDispatch();

  if (!file) return null;

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
        {/* Show Image Preview if Content Type is Image */}
        {file.contentType && file.contentType.startsWith("image/") ? (
          <img src={file.fileUrl} alt={file.filename} className="w-12 h-12 rounded-lg object-cover" />
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
        {/* --- DOWNLOAD BUTTON --- */}
        <a
          target="_blank"
          href={file.fileUrl}
          download={file.filename} // Suggests a filename to the browser
          className="p-2 rounded-full text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
          aria-label="Download file"
          title="Download"
        >
          <DownloadIcon className="w-5 h-5" />
        </a>

        {/* --- DELETE BUTTON --- */}
        <button 
            onClick={handleDelete} 
            className="p-2 rounded-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Delete file"
            title="Delete"
        >
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

export default FileItem;