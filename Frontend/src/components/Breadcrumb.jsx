import { useDispatch, useSelector } from "react-redux";
import { navigateToFolder, goToRoot } from "../store/folderSlice";

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const { folderPath } = useSelector((state) => state.folder);

  return (
    <div className="flex items-center gap-2 text-[14px] mb-6">
      {/* Home/Root */}
      <button
        onClick={() => dispatch(goToRoot())}
        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        My Drive
      </button>

      {/* Path segments */}
      {folderPath.map((segment, index) => (
        <div key={segment.id} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={() => dispatch(navigateToFolder({ folderId: segment.id, folderName: segment.name }))}
            className={`transition-colors ${
              index === folderPath.length - 1
                ? "text-black/80 font-medium"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {segment.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;