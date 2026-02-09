import { useSelector } from "react-redux";
import FileItem from "./FileItem";

const FileList = () => {
  const { files } = useSelector((state) => state.file);
  const { currentFolderId } = useSelector((state) => state.folder);

  // Filter files to show only those in the current folder
  const currentFiles = files.filter(
    file => (file.folderId || null) === currentFolderId
  );

  console.log("FileList - current folder:", currentFolderId);
  console.log("FileList - filtered files:", currentFiles);

  // If no files in current folder, show empty state
  if (!currentFiles || currentFiles.length === 0) {
    return (
      <div className="bg-slate-50 border border-black/5 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-black/5">
          <svg className="w-8 h-8 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-black/80 mb-2">No files here</h3>
        <p className="text-[14px] text-black/50">Upload your first file to this folder</p>
      </div>
    );
  }

  // Show files in current folder
  return (
    <div className="space-y-2">
      {currentFiles.map((file) => (
        <FileItem key={file._id} file={file} />
      ))}
    </div>
  );
};

export default FileList;