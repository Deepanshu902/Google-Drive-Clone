import { useSelector } from "react-redux";
import FileItem from "./FileItem";

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">No files yet</h3>
    <p className="text-slate-500 text-sm">Upload your first file to get started</p>
  </div>
);

const FileList = () => {
  const { files } = useSelector((state) => state.file);

  if (!files || files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileItem key={file._id} file={file} />
      ))}
    </div>
  );
};

export default FileList;