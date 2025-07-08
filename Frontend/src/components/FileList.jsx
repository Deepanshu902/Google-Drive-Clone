import { useSelector } from "react-redux";
import FileItem from "./FileItem";

const FileList = () => {
  const { files } = useSelector((state) => state.file);

  return (
    <div className="mt-6 bg-gray-900 p-6 rounded-lg shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">Your Files</h2>

      {files.length === 0 ? (
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