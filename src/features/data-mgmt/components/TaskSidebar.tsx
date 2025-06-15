"use client";

interface Label {
  name: string;
  color: string;
}

interface TaskSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  labels: Label[];
  onLabelModalOpen: () => void;
}

export default function TaskSidebar({
  activeTab,
  setActiveTab,
  labels,
  onLabelModalOpen,
}: TaskSidebarProps) {
  return (
    <div className="w-full lg:w-60 bg-white rounded-md shadow-sm p-4 order-2 lg:order-1">
      <div className="mb-6">
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">
          FILTERS:
        </h3>
        <div className="space-y-1">
          <div
            className={`px-3 py-2 rounded-md text-sm ${
              activeTab === "all"
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer transition-colors`}
            onClick={() => setActiveTab("all")}
          >
            All tasks
          </div>
          <div
            className={`px-3 py-2 rounded-md text-sm ${
              activeTab === "survey"
                ? "bg-red-50 text-[#F30] font-medium"
                : "hover:bg-gray-100"
            } cursor-pointer flex items-center transition-colors`}
            onClick={() => setActiveTab("survey")}
          >
            <span className="text-gray-700 mr-2">›</span> Selected Survey
            Tasks
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 flex items-center">
          LABELS:
          <button
            className="ml-1 text-[#F30] hover:text-[#E20] focus:outline-none"
            onClick={onLabelModalOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </h3>

        <div className="space-y-1 mt-2">
          {labels.map((label) => (
            <div key={label.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: label.color }}
              ></span>
              <span
                className="text-sm text-gray-700 cursor-pointer hover:text-[#F30]"
                onClick={() => alert(`Clicked on ${label.name} label`)}
              >
                {label.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}