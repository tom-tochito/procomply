"use client";

interface ActiveFilters {
  activeOnly: boolean;
  hampstead: boolean;
  ealing: boolean;
  camden: boolean;
  leased: boolean;
  archived: boolean;
  complex: boolean;
}

interface ComplianceFiltersProps {
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  buildingUse: string;
  setBuildingUse: (use: string) => void;
  roomUse: string;
  setRoomUse: (use: string) => void;
  buildingManagers: string;
  setBuildingManagers: (managers: string) => void;
}

export default function ComplianceFilters({
  activeFilters,
  setActiveFilters,
  buildingUse,
  setBuildingUse,
  roomUse,
  setRoomUse,
  buildingManagers,
  setBuildingManagers,
}: ComplianceFiltersProps) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.activeOnly
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({
              ...prev,
              activeOnly: !prev.activeOnly,
            }))
          }
        >
          Active Divisions
        </button>
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.hampstead
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({
              ...prev,
              hampstead: !prev.hampstead,
            }))
          }
        >
          Hampstead
        </button>
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.ealing
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({ ...prev, ealing: !prev.ealing }))
          }
        >
          Ealing
        </button>
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.camden
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({ ...prev, camden: !prev.camden }))
          }
        >
          Camden
        </button>
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.leased
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({ ...prev, leased: !prev.leased }))
          }
        >
          Leased
        </button>
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeFilters.archived
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setActiveFilters((prev) => ({
              ...prev,
              archived: !prev.archived,
            }))
          }
        >
          Archived
        </button>
      </div>

      <div className="flex gap-2 ml-auto">
        <select 
          className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-36 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
          value={buildingUse}
          onChange={(e) => setBuildingUse(e.target.value)}
        >
          <option>Building Use</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Mixed</option>
        </select>

        <select 
          className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-36 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
          value={roomUse}
          onChange={(e) => setRoomUse(e.target.value)}
        >
          <option>Room Use</option>
          <option>Office</option>
          <option>Apartment</option>
          <option>Common Area</option>
        </select>

        <select 
          className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white appearance-none pr-8 w-40 focus:outline-none focus:ring-2 focus:ring-[#F30] focus:border-transparent"
          value={buildingManagers}
          onChange={(e) => setBuildingManagers(e.target.value)}
        >
          <option>Building Managers</option>
          <option>All Managers</option>
          <option>Active Managers</option>
        </select>
      </div>
    </>
  );
}