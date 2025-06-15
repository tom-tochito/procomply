"use client";

interface ComplianceSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function ComplianceSearch({
  searchTerm,
  setSearchTerm,
}: ComplianceSearchProps) {
  return (
    <input
      type="text"
      placeholder="search buildings"
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}