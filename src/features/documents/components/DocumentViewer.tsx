"use client";

import React from "react";
import { X, Download, ExternalLink } from "lucide-react";
import { DocumentWithRelations } from "@/features/documents/models";
import { getFileUrl } from "@/common/utils/file";

interface DocumentViewerProps {
  document: DocumentWithRelations | null;
  tenantSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: DocumentWithRelations) => void;
}

export default function DocumentViewer({
  document,
  tenantSlug,
  isOpen,
  onClose,
  onDownload,
}: DocumentViewerProps) {
  if (!isOpen || !document) return null;

  const fileUrl = document.path ? getFileUrl(tenantSlug, document.path) : null;
  const extension = document.name.split(".").pop()?.toLowerCase() || "";
  
  // Check if file can be previewed
  const canPreview = ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension);
  const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension);
  const isPDF = extension === "pdf";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {document.name}
            </h2>
            <p className="text-sm text-gray-500">
              {document.type} • {(document.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F30]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={() => fileUrl && window.open(fileUrl, "_blank")}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F30]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F30] rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {fileUrl && canPreview ? (
            <div className="h-full w-full flex items-center justify-center">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fileUrl}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : isPDF ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-full"
                  title={document.name}
                />
              ) : null}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg mb-4">Preview not available for this file type</p>
              <button
                onClick={() => onDownload(document)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F30] hover:bg-[#E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F30]"
              >
                <Download className="h-5 w-5 mr-2" />
                Download to View
              </button>
            </div>
          )}
        </div>

        {/* Footer with document info */}
        <div className="border-t px-4 py-3 bg-gray-50">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {document.docCategory && (
              <div>
                <span className="font-medium">Category:</span> {document.docCategory}
              </div>
            )}
            {document.reference && (
              <div>
                <span className="font-medium">Reference:</span> {document.reference}
              </div>
            )}
            {document.isStatutory !== undefined && (
              <div>
                <span className="font-medium">Type:</span>{" "}
                {document.isStatutory ? "Statutory" : "Non-Statutory"}
              </div>
            )}
            {document.expiryDate && (
              <div>
                <span className="font-medium">Expires:</span>{" "}
                {new Date(document.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}