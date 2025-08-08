import React from "react";
import { Document } from "@/features/documents/models";
import { 
  X, 
  Info, 
  FileText, 
  History, 
  Tag, 
  Download, 
  Share2, 
  Building 
} from "lucide-react";

// Props definition
interface DocumentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document; // The document data to display
  onDownload?: (document: Document) => void;
}

// --- Icon Components ---
const CloseIcon = X;

const InfoIcon = Info;

const DocumentIcon = FileText;

const HistoryIcon = History;

const TagIcon = Tag;

const DownloadIcon = Download;

const ShareIcon = Share2;

const BuildingIcon = Building;

const DocumentDetailsDialog: React.FC<DocumentDetailsDialogProps> = ({
  isOpen,
  onClose,
  document,
  onDownload,
}) => {
  const [activeSidebarItem, setActiveSidebarItem] = React.useState("details");

  if (!isOpen) return null;

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // --- Sidebar Configuration ---
  const sidebarItems = [
    { id: "details", label: "Details", icon: InfoIcon },
    { id: "preview", label: "Preview", icon: DocumentIcon },
    { id: "history", label: "History", icon: HistoryIcon },
    { id: "metadata", label: "Metadata", icon: TagIcon },
    { id: "related", label: "Related", icon: BuildingIcon },
  ];

  // Get file icon based on type
  const getFileIcon = () => {
    const type = document.type.toLowerCase();
    if (type === "pdf") {
      return (
        <div className="bg-red-100 text-red-700 w-10 h-10 rounded flex items-center justify-center">
          <span className="text-xs font-bold">PDF</span>
        </div>
      );
    } else if (type === "docx" || type === "doc") {
      return (
        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded flex items-center justify-center">
          <span className="text-xs font-bold">DOC</span>
        </div>
      );
    } else if (type === "xlsx" || type === "xls") {
      return (
        <div className="bg-green-100 text-green-700 w-10 h-10 rounded flex items-center justify-center">
          <span className="text-xs font-bold">XLS</span>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-100 text-gray-700 w-10 h-10 rounded flex items-center justify-center">
          <DocumentIcon className="h-5 w-5" />
        </div>
      );
    }
  };

  // Status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-gray-100 text-gray-800";

    if (status === "Active") {
      bgColor = "bg-green-100 text-green-800";
    } else if (status === "Archived") {
      bgColor = "bg-gray-100 text-gray-800";
    } else if (status === "Pending") {
      bgColor = "bg-yellow-100 text-yellow-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
      >
        {status}
      </span>
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
            {document.name}
          </h2>
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4 flex-shrink-0">
            <button 
              onClick={() => onDownload && onDownload(document)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium whitespace-nowrap flex items-center"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={() => {
                // Share functionality - copy link to clipboard
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  alert('Document link copied to clipboard!');
                });
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium whitespace-nowrap flex items-center"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
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
          <div className="flex items-center">
            <span className="text-gray-300 mr-1.5">Category:</span>
            <span className="font-semibold text-white">
              {document.docCategory || document.category || "Uncategorized"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-1.5">Status:</span>
            {renderStatusBadge(document.isActive ? "Active" : "Inactive")}
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-1.5">Size:</span>
            <span className="font-semibold text-white">{document.size}</span>
          </div>
          {/* Align right */}
          <div className="hidden sm:flex flex-grow justify-end space-x-4">
            <span className="flex items-center text-gray-300">
              <span className="mr-1">Version:</span>
              <span className="font-semibold">1.0</span>
            </span>
          </div>
        </div>

        {/* Dialog Body Area (Sidebar + Content) */}
        <div className="flex flex-col sm:flex-row flex-grow overflow-hidden">
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

          {/* Main Content Area */}
          <div className="flex-grow flex flex-col bg-white overflow-hidden">
            {/* Tab Content - Scrollable */}
            <div className="flex-grow p-3 sm:p-4 md:p-6 overflow-y-auto">
              {/* Section Header (Matches Sidebar Active Item) */}
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 md:mb-5 flex items-center text-gray-700">
                {(() => {
                  const activeItem = sidebarItems.find(
                    (i) => i.id === activeSidebarItem
                  );
                  if (!activeItem) return null;
                  const Icon = activeItem.icon;
                  return (
                    <>
                      <Icon className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-gray-600" />
                      {activeItem.label}
                    </>
                  );
                })()}
              </h3>

              {/* --- Details Section Content --- */}
              {activeSidebarItem === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-3 sm:gap-y-4 md:gap-y-5 text-xs sm:text-sm">
                  {/* Left Column */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Document Name:
                      </p>
                      <div className="flex items-center">
                        {getFileIcon()}
                        <p className="ml-3 text-gray-800 font-medium">
                          {document.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">File Type:</p>
                      <p className="text-gray-800 font-medium">
                        {document.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Category:</p>
                      <p className="text-gray-800 font-medium">
                        {document.docCategory || document.category || "Uncategorized"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Status:</p>
                      <div>{renderStatusBadge(document.isActive ? "Active" : "Inactive")}</div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Description:
                      </p>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {document.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Upload Date:
                      </p>
                      <p className="text-gray-800 font-medium">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Uploaded By:
                      </p>
                      <p className="text-gray-800 font-medium">
                        Unknown
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">File Size:</p>
                      <p className="text-gray-800 font-medium">
                        {document.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Last Accessed:
                      </p>
                      <p className="text-gray-800 font-medium">
                        Unknown
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Version:</p>
                      <p className="text-gray-800 font-medium">
                        1.0
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Preview Section --- */}
              {activeSidebarItem === "preview" && (
                <div className="space-y-4 text-sm">
                  <div className="border rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <DocumentIcon className="h-16 w-16 text-gray-400 mb-3" />
                    <p className="text-gray-700 font-medium mb-2">
                      {document.name}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Preview not available. Click the button below to download
                      and view this file.
                    </p>
                    <button 
                      onClick={() => onDownload && onDownload(document)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download File
                    </button>
                  </div>
                </div>
              )}

              {/* --- History Section --- */}
              {activeSidebarItem === "history" && (
                <div className="space-y-4 text-sm">
                  <div className="border-b pb-2">
                    <p className="text-gray-500 mb-1">
                      Current Version:{" "}
                      <span className="font-medium text-gray-700">
                        1.0
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-400 pl-4 pb-4 relative">
                      <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] top-0"></div>
                      <p className="font-medium text-gray-800">
                        {new Date(document.uploadedAt).toLocaleDateString()} - Version{" "}
                        1.0
                      </p>
                      <p className="text-gray-600 mt-1">
                        Uploaded by Unknown
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Current version
                      </p>
                    </div>

                    {false && (
                      <div className="border-l-2 border-gray-300 pl-4 pb-4 relative">
                        <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-0"></div>
                        <p className="font-medium text-gray-700">
                          10/02/2024 - Version 0.9
                        </p>
                        <p className="text-gray-600 mt-1">
                          Updated by Unknown
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Draft version
                        </p>
                      </div>
                    )}

                    <div className="border-l-2 border-gray-300 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-0"></div>
                      <p className="font-medium text-gray-700">
                        05/01/2024 - Version 1.0
                      </p>
                      <p className="text-gray-600 mt-1">
                        Created by Unknown
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Initial upload
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Metadata Section --- */}
              {activeSidebarItem === "metadata" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {false ? (
                        [].map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No tags</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Document ID:
                      </p>
                      <p className="text-gray-800 font-medium">{document.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">MIME Type:</p>
                      <p className="text-gray-800 font-medium">
                        {document.type.toUpperCase() === "PDF"
                          ? "application/pdf"
                          : document.type.toUpperCase() === "DOCX"
                          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          : document.type.toUpperCase() === "XLSX"
                          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          : "application/octet-stream"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Created:</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        Last Modified:
                      </p>
                      <p className="text-gray-800 font-medium">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- Related Section --- */}
              {activeSidebarItem === "related" && (
                <div className="space-y-4 text-sm">
                  {false && (
                    <div>
                      <p className="text-gray-500 text-xs mb-2">
                        Related Building:
                      </p>
                      <div className="flex items-center p-3 border rounded-md bg-gray-50">
                        <BuildingIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Building
                          </p>
                          <p className="text-xs text-gray-500">Fordwych Road</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {false && (
                    <div>
                      <p className="text-gray-500 text-xs mb-2 mt-4">
                        Related Task:
                      </p>
                      <div className="flex items-center p-3 border rounded-md bg-gray-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        <p className="font-medium text-gray-800">
                          Monthly H&S Visit (Includes Temp & Lights)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-gray-500 text-xs mb-2">
                      Related Documents:
                    </p>
                    <div className="space-y-2">
                      {(document.docCategory || document.category) === "Certification" ? (
                        <>
                          <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                            <div className="bg-red-100 text-red-700 w-8 h-8 rounded flex items-center justify-center mr-3">
                              <span className="text-xs font-bold">PDF</span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-800">
                                Previous Fire Safety Certificate.pdf
                              </p>
                              <p className="text-xs text-gray-500">
                                12/04/2023 • 2.1 MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition">
                            <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded flex items-center justify-center mr-3">
                              <span className="text-xs font-bold">DOC</span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-800">
                                Certification Cover Letter.docx
                              </p>
                              <p className="text-xs text-gray-500">
                                15/04/2024 • 350 KB
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 italic py-4 text-center">
                          No related documents found
                        </p>
                      )}
                    </div>
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
      `}</style>
    </div>
  );
};

export default DocumentDetailsDialog;
