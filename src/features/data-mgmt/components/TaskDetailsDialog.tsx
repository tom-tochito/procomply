import React from "react";
import { Task } from "@/data/tasks"; // Import Task type from data
import Image from "next/image"; // Import next/image
import { 
  Info, 
  Image as ImageIcon, 
  X, 
  Users, 
  Settings, 
  FileText, 
  Building2, 
  CheckCircle, 
  ClipboardCheck, 
  MessageSquare, 
  PieChart,
  PlusCircle 
} from "lucide-react";

// Props definition
interface TaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task; // The task data to display
  // Optional: Pass building data if not included directly in task
  building?: { name: string; image?: string };
}

// --- Icon Components (Using Lucide React icons) ---

const InfoIcon = Info;

const PhotoIcon = ImageIcon;

const CloseIcon = X;

const UserGroupIcon = Users;

const CogIcon = Settings;

// Other icon imports
const DocumentIcon = FileText;

const LegislationIcon = Building2;

const StatusIcon = CheckCircle;

const CompletionIcon = ClipboardCheck;

const FeedIcon = MessageSquare;

const RAGIcon = PieChart;

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
  const buildingName = building?.name || `Building ${task.building_id}`;
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
    { id: "feed", label: "Feed", icon: FeedIcon },
    { id: "rag", label: "RAG", icon: RAGIcon },
    { id: "documents", label: "Documents", icon: DocumentIcon },
    { id: "status", label: "Status", icon: StatusIcon },
    { id: "legislation", label: "Legislation", icon: LegislationIcon },
    { id: "responsible", label: "Responsible", icon: UserGroupIcon },
    { id: "completion", label: "Completion", icon: CompletionIcon },
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
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-2 sm:p-4 md:p-8 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      {/* Dialog Box - Animate entrance */}
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-dialog-enter"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dialog from closing it
      >
        {/* Dialog Header */}
        <div className="bg-gray-800 text-white px-3 sm:px-5 py-3 flex justify-between items-center flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate pr-2 sm:pr-4">
            {task.description || "Task Details"}
          </h2>
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4 flex-shrink-0">
            {/* Progress */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <ProgressBar percentage={getProgressPercentage(task.progress)} />
              <span className="hidden sm:inline font-medium">
                {getProgressPercentage(task.progress)}% progress
              </span>
              <span className="sm:hidden font-medium">
                {getProgressPercentage(task.progress)}%
              </span>
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium whitespace-nowrap">
              Start Job
            </button>
            {/* Workflow / Assignee Icons (Placeholders) */}
            <button
              title="Workflow"
              className="text-gray-400 hover:text-white hidden sm:block"
            >
              <CogIcon className="h-5 w-5" />
            </button>
            <button
              title="Main Assignee"
              className="text-gray-400 hover:text-white hidden sm:block"
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
        <div className="bg-gray-700 text-white px-3 sm:px-5 py-1.5 flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 text-xs flex-shrink-0 border-t border-gray-600">
          {renderDueDateBadge("Due Date", task.due_date)}
          {renderMetadataBadge("Priority", task.priority)}
          {renderMetadataBadge("Risk Level", task.risk_level)}
          {/* Placeholder for Workflow/Assignee Text - align right */}
          <div className="hidden sm:flex flex-grow justify-end space-x-4">
            <span className="flex items-center text-gray-300">
              <CogIcon className="h-4 w-4 mr-1" /> Workflow: --
            </span>
            <span className="flex items-center text-gray-300">
              <UserGroupIcon className="h-4 w-4 mr-1" /> Main Assignee: --
            </span>
          </div>
        </div>

        {/* Dialog Body Area (Sidebar + Content) */}
        <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">
          {" "}
          {/* Main flex container for body */}
          {/* Mobile Tabs for Sidebar */}
          <div className="sm:hidden flex overflow-x-auto px-2 py-2 border-b border-gray-200 bg-gray-50">
            {sidebarItems.map((item) => {
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`flex-shrink-0 px-3 py-1 mx-1 rounded-full text-xs ${
                    isActive
                      ? "bg-gray-300 text-gray-900 font-medium"
                      : "text-gray-600 bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden sm:block w-32 md:w-48 lg:w-56 bg-gray-100 border-r border-gray-200 p-2 sm:p-3 md:p-4 flex-shrink-0 overflow-y-auto space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 rounded flex items-center text-xs sm:text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-gray-300 text-gray-900 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0 ${
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
            <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 border-b border-gray-200 flex-shrink-0 flex space-x-3 sm:space-x-4 md:space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("general")}
                className={`pb-2 text-xs sm:text-sm font-medium flex items-center border-b-2 focus:outline-none whitespace-nowrap ${
                  activeTab === "general"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <InfoIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-1.5" />{" "}
                General data
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`pb-2 text-xs sm:text-sm font-medium flex items-center border-b-2 focus:outline-none whitespace-nowrap ${
                  activeTab === "photos"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <PhotoIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-1.5" />{" "}
                Task photos
              </button>
            </div>
            {/* Tab Content - Scrollable */}
            <div className="flex-grow p-3 sm:p-4 md:p-6 overflow-y-auto">
              {activeTab === "general" && (
                <div className="w-full">
                  {/* Section Header (Matches Sidebar Active Item) */}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 md:mb-5 flex items-center text-gray-700">
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
                          <Icon className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-gray-600" />{" "}
                          {activeItem.label}{" "}
                        </>
                      );
                    })()}
                  </h3>

                  {/* --- General Section Content --- */}
                  {activeSidebarItem === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-3 sm:gap-y-4 md:gap-y-5 text-xs sm:text-sm">
                      {/* Left Column */}
                      <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Type:</p>
                          <p className="text-gray-800 font-medium">
                            Preventive
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Building:
                          </p>
                          <p className="text-gray-800 font-medium">
                            {buildingName}
                          </p>
                          {buildingImage && (
                            <div className="mt-2">
                              <Image
                                src={buildingImage}
                                alt={buildingName}
                                width={320}
                                height={180}
                                className="w-full max-w-xs rounded-md border border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Code:</p>
                          <p className="text-gray-800 font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Name:</p>
                          <p className="text-gray-800 font-medium">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Observation:
                          </p>
                          <p className="text-gray-800 font-medium leading-relaxed">
                            The client has a requirement for regular H&S
                            inspections
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Instruction:
                          </p>
                          <p className="text-gray-800 font-medium leading-relaxed">
                            ASAP Comply to visit each property and summarise
                            health & safety findings including fire safety
                            checks
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Risk Area:
                          </p>
                          <p className="text-gray-800 font-medium">
                            Health & Safety
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Subsection:
                          </p>
                          <p className="text-gray-800 font-medium">Report</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Due Date:
                          </p>
                          <p className="font-semibold bg-blue-500 text-white px-2 py-0.5 rounded inline-block text-xs">
                            {task.due_date}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Profile Section --- */}
                  {activeSidebarItem === "profile" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Priority:
                          </p>
                          <p className="font-semibold bg-yellow-500 text-white px-2 py-0.5 rounded inline-block text-xs">
                            {task.priority === "M"
                              ? "Medium"
                              : task.priority === "H"
                              ? "High"
                              : "Low"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Risk Level:
                          </p>
                          <p className="font-semibold bg-blue-500 text-white px-2 py-0.5 rounded inline-block text-xs">
                            {task.risk_level === "L"
                              ? "Low"
                              : task.risk_level === "M"
                              ? "Medium"
                              : "High"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Statutory:
                          </p>
                          <p className="text-gray-800 font-medium">Yes</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Critical:
                          </p>
                          <p className="text-gray-800 font-medium">No</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Number of Attached Documents:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Number of Required Documents:
                          </p>
                          <p className="text-gray-800 font-medium">1</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Feed Section --- */}
                  {activeSidebarItem === "feed" && (
                    <div className="space-y-4 text-sm">
                      <div className="text-center text-gray-500 py-8">
                        No activities
                      </div>
                    </div>
                  )}

                  {/* --- RAG Section --- */}
                  {activeSidebarItem === "rag" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Repeat Value:
                          </p>
                          <p className="text-gray-800 font-medium">1</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Repeat Unit:
                          </p>
                          <p className="text-gray-800 font-medium">MONTHLY</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Amber Value:
                          </p>
                          <p className="text-gray-800 font-medium">1</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Amber Unit:
                          </p>
                          <p className="text-gray-800 font-medium">WEEKLY</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Documents Section --- */}
                  {activeSidebarItem === "documents" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div className="border rounded-md p-3">
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              className="mr-2"
                              disabled
                              checked
                            />
                            <span className="text-sm font-medium">
                              Uploaded / linked
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm italic">
                            No documents uploaded
                          </p>
                        </div>
                        <div className="mt-4">
                          <button className="flex items-center text-amber-600 hover:text-amber-800 font-medium text-sm">
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Start job to activate document upload
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Status Section --- */}
                  {activeSidebarItem === "status" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Compliant:
                          </p>
                          <p className="text-gray-800 font-medium">Yes</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Due Status:
                          </p>
                          <p className="text-gray-800 font-medium">Pending</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Job Status:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            On Hold:
                          </p>
                          <p className="text-gray-800 font-medium">No</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            On Hold Until:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Legislation Section --- */}
                  {activeSidebarItem === "legislation" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div className="bg-gray-100 rounded-md p-3 flex items-center">
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">
                              Health and Safety at Work etc Act 1974
                            </p>
                            <p className="text-xs text-gray-500">HASAWA 1974</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-md p-3 flex items-center">
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">
                              The Management of Health & Safety at Work
                              Regulations 1999
                            </p>
                            <p className="text-xs text-gray-500">MHSWR 1999</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-md p-3 flex items-center">
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">
                              The Workplace (Health, Safety and Welfare)
                              Regulations 1992
                            </p>
                            <p className="text-xs text-gray-500">WHSWR 1992</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Responsible Section --- */}
                  {activeSidebarItem === "responsible" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">Team:</p>
                          <p className="text-gray-800 font-medium">
                            {task.team || "ASAP Comply Ltd"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Assignee:
                          </p>
                          <p className="text-gray-800 font-medium">
                            {task.assignee || "Mark Burchall (ASAP)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- Completion Section --- */}
                  {activeSidebarItem === "completion" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 gap-y-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Progress %:
                          </p>
                          <p className="text-gray-800 font-medium">0</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            In Progress:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            CompletedBy:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            CompletedDate:
                          </p>
                          <p className="text-gray-800 font-medium">—</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Last Completed:
                          </p>
                          <p className="text-gray-800 font-medium">
                            01/04/2025
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            Last Completed By:
                          </p>
                          <p className="text-gray-800 font-medium">
                            Mark Burchall - ASAP Comply Ltd
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">
                            On-Time:
                          </p>
                          <p className="text-gray-800 font-medium">No</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "photos" && (
                <div className="space-y-5">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-gray-700">
                    <PhotoIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-gray-600" />
                    Task Photos
                  </h3>

                  {/* Empty state for photos */}
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center">
                    <PhotoIcon className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm mb-2">
                      No photos have been added to this task yet
                    </p>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium">
                      Upload Photos
                    </button>
                  </div>
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
