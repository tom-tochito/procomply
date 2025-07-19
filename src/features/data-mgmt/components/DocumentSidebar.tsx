"use client";

interface DocumentSidebarProps {
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedFileType: string | null;
  setSelectedFileType: (fileType: string | null) => void;
  selectedStatutory: boolean | null;
  setSelectedStatutory: (statutory: boolean | null) => void;
  selectedBuilding: string | null;
  setSelectedBuilding: (building: string | null) => void;
  selectedDivision: string | null;
  setSelectedDivision: (division: string | null) => void;
  selectedComplex: string | null;
  setSelectedComplex: (complex: string | null) => void;
  categories: string[];
  fileTypes: string[];
  buildings: { id: string; name: string }[];
  divisions: string[];
  complexes: string[];
}

// TODO: Fetch categories from database instead of hardcoding
export default function DocumentSidebar({
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedFileType,
  setSelectedFileType,
  selectedStatutory,
  setSelectedStatutory,
  selectedBuilding,
  setSelectedBuilding,
  selectedDivision,
  setSelectedDivision,
  selectedComplex,
  setSelectedComplex,
  categories,
  fileTypes,
  buildings,
  divisions,
  complexes,
}: DocumentSidebarProps) {
  return (
    <div className="w-full lg:w-64 xl:w-72 bg-white rounded-md shadow-sm p-3 md:p-4 order-2 lg:order-1 max-h-[calc(100vh-12rem)] overflow-y-auto sticky top-4">
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

      {buildings.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
            BUILDING:
          </h3>
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
            <button
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedBuilding === null
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer transition-colors`}
              onClick={() => setSelectedBuilding(null)}
            >
              All Buildings
            </button>
            {buildings.map((building) => (
              <button
                key={building.id}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                  selectedBuilding === building.id
                    ? "bg-red-50 text-[#F30] font-medium"
                    : "hover:bg-gray-100"
                } cursor-pointer flex items-center transition-colors`}
                onClick={() => setSelectedBuilding(building.id)}
              >
                <span className="text-gray-700 mr-2">›</span>
                <span className="truncate">{building.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {divisions.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
            DIVISION:
          </h3>
          <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
            <button
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedDivision === null
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer transition-colors`}
              onClick={() => setSelectedDivision(null)}
            >
              All Divisions
            </button>
            {divisions.map((division) => (
              <button
                key={division}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                  selectedDivision === division
                    ? "bg-red-50 text-[#F30] font-medium"
                    : "hover:bg-gray-100"
                } cursor-pointer flex items-center transition-colors`}
                onClick={() => setSelectedDivision(division)}
              >
                <span className="text-gray-700 mr-2">›</span>
                <span className="truncate">{division}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {complexes.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
            COMPLEX:
          </h3>
          <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
            <button
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedComplex === null
                  ? "bg-red-50 text-[#F30] font-medium"
                  : "hover:bg-gray-100"
              } cursor-pointer transition-colors`}
              onClick={() => setSelectedComplex(null)}
            >
              All Complexes
            </button>
            {complexes.map((complex) => (
              <button
                key={complex}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                  selectedComplex === complex
                    ? "bg-red-50 text-[#F30] font-medium"
                    : "hover:bg-gray-100"
                } cursor-pointer flex items-center transition-colors`}
                onClick={() => setSelectedComplex(complex)}
              >
                <span className="text-gray-700 mr-2">›</span>
                <span className="truncate">{complex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
          DOCUMENT TYPE:
        </h3>
        <div className="space-y-1">
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatutory === null
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer transition-colors`}
            onClick={() => setSelectedStatutory(null)}
          >
            All Documents
          </button>
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatutory === true
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setSelectedStatutory(true)}
          >
            <span className="text-gray-700 mr-2">›</span> Statutory
          </button>
          <button
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
              selectedStatutory === false
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setSelectedStatutory(false)}
          >
            <span className="text-gray-700 mr-2">›</span> Non-Statutory
          </button>
        </div>
      </div>

      {categories.length > 0 && (
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
      )}

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
              <span className="truncate">
                {fileType === "pdf"
                  ? "PDF"
                  : fileType === "doc"
                  ? "Word Documents"
                  : fileType === "xls"
                  ? "Excel Sheets"
                  : fileType === "image"
                  ? "Images"
                  : fileType}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}