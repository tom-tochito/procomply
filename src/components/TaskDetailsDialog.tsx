import React from "react";
import { Task } from "@/data/tasks"; // Import Task type from data

// Props definition
interface TaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task; // The task data to display
  // Optional: Pass building data if not included directly in task
  building?: { name: string; image?: string };
}

// --- Icon Components (Replace with your actual icon library/SVGs if available) ---

const InfoIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PhotoIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CloseIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UserGroupIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const CogIcon = (
  { className = "h-5 w-5" }: { className?: string } // Example icon for workflow
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// --- Helper Components ---

// Simple Progress Bar Component
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-20 bg-gray-600 rounded-full h-2 overflow-hidden">
    <div
      className="bg-blue-500 h-2 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  isOpen,
  onClose,
  task,
  building,
}) => {
  const [activeTab, setActiveTab] = React.useState<"general" | "photos">(
    "general"
  );
  const [activeSidebarItem, setActiveSidebarItem] = React.useState("general");

  // Use passed building prop or fallbacks
  const buildingName = building?.name || `Building ${task.buildingId}`;
  const buildingImage = building?.image;

  if (!isOpen) return null;

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper function to convert progress string to percentage
  const getProgressPercentage = (progressStatus?: string): number => {
    if (!progressStatus) return 0;
    // Add more sophisticated mapping if needed based on actual statuses
    if (progressStatus.toLowerCase() === "completed") return 100;
    if (progressStatus.toLowerCase() === "in progress") return 50; // Example value
    if (progressStatus.toLowerCase() === "not started") return 0;
    // Default case or handle other statuses
    return 0;
  };

  // --- Sidebar Configuration ---
  // Replace placeholder icons with actual ones
  const sidebarItems = [
    { id: "general", label: "General", icon: InfoIcon },
    { id: "profile", label: "Profile", icon: UserGroupIcon },
    { id: "feed", label: "Feed", icon: InfoIcon }, // Placeholder
    { id: "rag", label: "RAG", icon: InfoIcon }, // Placeholder
    { id: "documents", label: "Documents", icon: PhotoIcon }, // Placeholder - using photo for now
    { id: "status", label: "Status", icon: InfoIcon }, // Placeholder
    { id: "legislation", label: "Legislation", icon: InfoIcon }, // Placeholder
    { id: "responsible", label: "Responsible", icon: UserGroupIcon }, // Placeholder
    { id: "completion", label: "Completion", icon: InfoIcon }, // Placeholder
  ];

  // --- Badge Rendering Logic ---
  const renderMetadataBadge = (label: string, value: string) => {
    let bgColor = "bg-red-500"; // Default for Due Date and High Prio/Risk
    const textColor = "text-white";

    if (label === "Priority" || label === "Risk Level") {
      if (value === "M") bgColor = "bg-yellow-400";
      else if (value === "L") bgColor = "bg-green-500"; // Assuming L for Low
    } else {
      // Due Date styling (if different)
      bgColor = "bg-red-500";
    }

    return (
      <div className="flex items-center">
        <span className="text-gray-300 mr-1.5">{label}:</span>
        <span
          className={`font-semibold ${bgColor} ${textColor} px-2 py-0.5 rounded text-xs uppercase leading-none`}
        >
          {value}
        </span>
      </div>
    );
  };

  const renderDueDateBadge = (label: string, value: string) => {
    return (
      <div className="flex items-center">
        <span className="text-gray-300 mr-1.5">{label}:</span>
        <span className="font-semibold bg-red-500 text-white px-2 py-0.5 rounded text-xs uppercase leading-none">
          {value}
        </span>
      </div>
    );
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 sm:p-6 md:p-8 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      {/* Dialog Box - Animate entrance */}
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-dialog-enter"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dialog from closing it
      >
        {/* Dialog Header */}
        <div className="bg-gray-800 text-white px-5 py-3 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold truncate pr-4">
            {task.description || "Task Details"}
          </h2>
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            {/* Progress */}
            <div className="flex items-center space-x-2 text-sm">
              <ProgressBar percentage={getProgressPercentage(task.progress)} />
              <span className="hidden sm:inline font-medium">
                {/* Display percentage based on conversion */}
                {getProgressPercentage(task.progress)}% progress
              </span>
              <span className="sm:hidden font-medium">
                {/* Display percentage based on conversion */}
                {getProgressPercentage(task.progress)}%
              </span>
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-1.5 rounded text-sm font-medium whitespace-nowrap">
              Start Job
            </button>
            {/* Workflow / Assignee Icons (Placeholders) */}
            <button title="Workflow" className="text-gray-400 hover:text-white">
              <CogIcon className="h-5 w-5" />
            </button>
            <button
              title="Main Assignee"
              className="text-gray-400 hover:text-white"
            >
              <UserGroupIcon className="h-5 w-5" />
            </button>

            <button
              onClick={onClose}
              title="Close"
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="bg-gray-700 text-white px-5 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs flex-shrink-0 border-t border-gray-600">
          {renderDueDateBadge("Due Date", task.dueDate)}
          {renderMetadataBadge("Priority", task.priority)}
          {renderMetadataBadge("Risk Level", task.riskLevel)}
          {/* Placeholder for Workflow/Assignee Text - align right */}
          <div className="flex-grow flex justify-end space-x-4">
            <span className="flex items-center text-gray-300">
              <CogIcon className="h-4 w-4 mr-1" /> Workflow: --
            </span>
            <span className="flex items-center text-gray-300">
              <UserGroupIcon className="h-4 w-4 mr-1" /> Main Assignee: --
            </span>
          </div>
        </div>

        {/* Dialog Body Area (Sidebar + Content) */}
        <div className="flex flex-grow overflow-hidden">
          {" "}
          {/* Main flex container for body */}
          {/* Sidebar */}
          <div className="w-48 md:w-56 bg-gray-100 border-r border-gray-200 p-3 sm:p-4 flex-shrink-0 overflow-y-auto space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded flex items-center text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-gray-300 text-gray-900 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 mr-2 flex-shrink-0 ${
                      isActive ? "text-gray-700" : "text-gray-500"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          {/* Main Content Area (Tabs + Tab Content) */}
          <div className="flex-grow flex flex-col bg-white overflow-hidden">
            {" "}
            {/* Content area takes remaining space */}
            {/* Tabs */}
            <div className="px-4 sm:px-6 pt-4 border-b border-gray-200 flex-shrink-0 flex space-x-4 sm:space-x-6">
              <button
                onClick={() => setActiveTab("general")}
                className={`pb-2 text-sm font-medium flex items-center border-b-2 focus:outline-none ${
                  activeTab === "general"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <InfoIcon className="h-5 w-5 mr-1.5" /> General data
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`pb-2 text-sm font-medium flex items-center border-b-2 focus:outline-none ${
                  activeTab === "photos"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <PhotoIcon className="h-5 w-5 mr-1.5" /> Task photos
              </button>
            </div>
            {/* Tab Content - Scrollable */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
              {activeTab === "general" && (
                <div className="w-full">
                  {/* Section Header (Matches Sidebar Active Item) */}
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 flex items-center text-gray-700">
                    {/* Dynamically show icon and title based on sidebar selection */}
                    {(() => {
                      const activeItem = sidebarItems.find(
                        (i) => i.id === activeSidebarItem
                      );
                      if (!activeItem) return null;
                      const Icon = activeItem.icon;
                      return (
                        <>
                          {" "}
                          <Icon className="h-5 w-5 mr-2 text-gray-600" />{" "}
                          {activeItem.label}{" "}
                        </>
                      );
                    })()}
                  </h3>

                  {/* --- General Section Content --- */}
                  {activeSidebarItem === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-5 text-sm">
                      {/* Left Column */}
                      <div className="space-y-4 sm:space-y-5">
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Type:
                          </p>
                          <p className="text-gray-800 font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Code:
                          </p>
                          <p className="text-gray-800 font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Observation:
                          </p>
                          <p className="text-gray-800 font-medium leading-relaxed">
                            -
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Risk Area:
                          </p>
                          <p className="text-gray-800 font-medium">
                            {task.riskArea}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Due Date:
                          </p>
                          {/* Use red background only if overdue or high prio? Based on screenshot, it's always red */}
                          <p className="font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded inline-block text-xs sm:text-sm">
                            {task.dueDate}
                          </p>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="space-y-4 sm:space-y-5">
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Building:
                          </p>
                          <p className="text-gray-800 font-medium mb-1.5">
                            {buildingName}
                          </p>
                          {buildingImage && (
                            <img
                              src={buildingImage}
                              alt={buildingName}
                              className="h-28 w-auto rounded border border-gray-200 object-cover"
                              // Add error handling for images
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Name:
                          </p>
                          <p className="text-gray-800 font-medium">
                            {task.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Instruction:
                          </p>
                          <p className="text-gray-800 font-medium leading-relaxed">
                            -
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-0.5">
                            Subsection:
                          </p>
                          <p className="text-gray-800 font-medium">-</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* --- Placeholder for other sidebar sections --- */}
                  {activeSidebarItem !== "general" && (
                    <div className="text-center py-10 text-gray-400">
                      Content for &quot;
                      {
                        sidebarItems.find((i) => i.id === activeSidebarItem)
                          ?.label
                      }
                      &quot; goes here.
                    </div>
                  )}
                </div>
              )}
              {/* --- Task Photos Tab Content --- */}
              {activeTab === "photos" && (
                <div className="text-center py-10 text-gray-500">
                  Task Photos content area.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add CSS for animation */}
      <style jsx global>{`
        @keyframes dialog-enter {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-dialog-enter {
          animation: dialog-enter 0.2s ease-out forwards;
        }
        /* Optional: Improve scrollbar styling */
        /* ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; } */
      `}</style>
    </div>
  );
};

export default TaskDetailsDialog;
