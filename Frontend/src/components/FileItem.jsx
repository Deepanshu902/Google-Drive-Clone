import { useDispatch } from "react-redux";
import { deleteFile } from "../services/fileService";
import { removeFile } from "../store/fileSlice";

const FileItem = ({ file }) => {
  const dispatch = useDispatch();

  if (!file) return null;  // ✅ Prevents crashing if file is undefined

  const handleDelete = async () => {
    try {
      await deleteFile(file._id); 
      dispatch(removeFile(file._id)); 
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <li className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mt-2">
      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        {file.filename || "Unnamed File"}
      </a>

      {/* Show Image Preview if Content Type is Image */}
      {file.contentType && file.contentType.startsWith("image/") && (
        <img src={file.fileUrl} alt={file.filename} className="w-10 h-10 rounded-lg object-cover ml-4" />
      )}

      <button onClick={handleDelete} className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500">
        Delete
      </button>
    </li>
  );
};

export default FileItem;
