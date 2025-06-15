"use client";

interface DocumentSidebarProps {
  selectedDocCategory: string | null;
  setSelectedDocCategory: (category: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedFileType: string | null;
  setSelectedFileType: (fileType: string | null) => void;
  categories: string[];
  fileTypes: string[];
}

const docCategories = [
  "Asbestos",
  "Electrical",
  "Energy",
  "Environmental",
  "Equality / Disability",
  "Fire",
  "Gas",
  "Health and Safety",
  "Legionella",
  "Lift",
  "Miscellaneous",
  "Operation",
  "Third Party",
];

export default function DocumentSidebar({
  selectedDocCategory,
  setSelectedDocCategory,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedFileType,
  setSelectedFileType,
  categories,
  fileTypes,
}: DocumentSidebarProps) {
  return (
    <div className="w-full lg:w-64 xl:w-72 bg-white rounded-md shadow-sm p-3 md:p-4 order-2 lg:order-1 max-h-[calc(100vh-12rem)] overflow-y-auto sticky top-4">
      <div className="mb-5">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
          DOC CATEGORIES:
        </h3>
        <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedDocCategory === null
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer transition-colors`}
            onClick={() => setSelectedDocCategory(null)}
          >
            All Categories
          </button>
          {docCategories.map((category) => (
            <button
              key={category}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedDocCategory === category
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer flex items-center transition-colors`}
              onClick={() =>
                setSelectedDocCategory(
                  selectedDocCategory === category ? null : category
                )
              }
            >
              <span className="text-gray-700 mr-2">›</span>
              <span className="truncate">{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
          FILTERS:
        </h3>
        <div className="space-y-1">
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatus === null
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer transition-colors`}
            onClick={() => setSelectedStatus(null)}
          >
            All Documents
          </button>
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatus === "Active"
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setSelectedStatus("Active")}
          >
            <span className="text-gray-700 mr-2">›</span> Active Documents
          </button>
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatus === "Pending"
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setSelectedStatus("Pending")}
          >
            <span className="text-gray-700 mr-2">›</span> Pending Review
          </button>
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatus === "Archived"
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setSelectedStatus("Archived")}
          >
            <span className="text-gray-700 mr-2">›</span> Archived Documents
          </button>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
          CATEGORIES:
        </h3>
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedCategory === category
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer flex items-center transition-colors`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            >
              <span className="text-gray-700 mr-2">›</span>
              <span className="truncate">{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
          FILE TYPES:
        </h3>
        <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
          {fileTypes.map((fileType) => (
            <button
              key={fileType}
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedFileType === fileType
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer flex items-center transition-colors`}
              onClick={() =>
                setSelectedFileType(
                  selectedFileType === fileType ? null : fileType
                )
              }
            >
              <span className="text-gray-700 mr-2">›</span>
              <span className="truncate">{fileType}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}