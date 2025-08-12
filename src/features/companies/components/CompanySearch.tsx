"use client";

interface CompanySearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function CompanySearch({
  searchTerm,
  setSearchTerm,
}: CompanySearchProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="search"
        className="border rounded-md pl-3 pr-10 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}