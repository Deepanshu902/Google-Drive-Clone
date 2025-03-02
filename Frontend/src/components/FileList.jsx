import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../services/fileService";
import { setFiles } from "../store/fileSlice";
import FileItem from "./FileItem";

const FileList = () => {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.file);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    async function fetchFiles() {
      try {
        const filesResponse = await getFiles();
        dispatch(setFiles(filesResponse.data));
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false); // ✅ Stop loading when request completes
      }
    }
    fetchFiles();
  }, [dispatch]);

  return (
    <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">Your Files</h2>

      {loading ? (
        <p className="text-gray-400">Loading files...</p> // ✅ Show loading text instead of "No files"
      ) : files.length === 0 ? (
        <p className="text-gray-400">No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <FileItem key={file._id} file={file} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
