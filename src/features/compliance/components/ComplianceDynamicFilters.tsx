"use client";

interface Division {
  id: string;
  name: string;
  type: string;
}

interface ComplianceDynamicFiltersProps {
  divisions: Division[];
  selectedDivisions: string[];
  setSelectedDivisions: (divisions: string[]) => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
  buildingUse: string;
  setBuildingUse: (use: string) => void;
  roomUse: string;
  setRoomUse: (use: string) => void;
  buildingManagers: string;
  setBuildingManagers: (managers: string) => void;
}

export default function ComplianceDynamicFilters({
  divisions,
  selectedDivisions,
  setSelectedDivisions,
  showArchived,
  setShowArchived,
  buildingUse,
  setBuildingUse,
  roomUse,
  setRoomUse,
  buildingManagers,
  setBuildingManagers,
}: ComplianceDynamicFiltersProps) {
  const toggleDivision = (divisionId: string) => {
    if (selectedDivisions.includes(divisionId)) {
      setSelectedDivisions(selectedDivisions.filter(id => id !== divisionId));
    } else {
      setSelectedDivisions([...selectedDivisions, divisionId]);
    }
  };

  // Separate active divisions
  const activeDivisions = divisions.filter(d => d.type === "Active");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Active Divisions Button */}
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            selectedDivisions.length === activeDivisions.length
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            if (selectedDivisions.length === activeDivisions.length) {
              setSelectedDivisions([]);
            } else {
              setSelectedDivisions(activeDivisions.map(d => d.id));
            }
          }}
        >
          Active Divisions
        </button>

        {/* Individual Division Buttons */}
        {activeDivisions.map(division => (
          <button
            key={division.id}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              selectedDivisions.includes(division.id)
                ? "bg-red-50 text-[#F30] font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => toggleDivision(division.id)}
          >
            {division.name}
          </button>
        ))}

        {/* Archived Button */}
        <button
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            showArchived
              ? "bg-red-50 text-[#F30] font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setShowArchived(!showArchived)}
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