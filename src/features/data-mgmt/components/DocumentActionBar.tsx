"use client";

import { Search, Upload } from "lucide-react";

interface DocumentActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onUploadClick: () => void;
}

export default function DocumentActionBar({
  searchTerm,
  setSearchTerm,
  onUploadClick,
}: DocumentActionBarProps) {
  return (
    <div className="bg-white rounded-md shadow-sm p-3 mb-3 md:mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <button
          onClick={onUploadClick}
          className="bg-[#F30] text-white px-3 py-2 text-sm rounded-md hover:bg-[#E20] transition-colors flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#F30] focus:ring-offset-2"
        >
          <Upload className="h-4 w-4 mr-2" />
          <span>Add document</span>
        </button>
      </div>
    </div>
  );
}