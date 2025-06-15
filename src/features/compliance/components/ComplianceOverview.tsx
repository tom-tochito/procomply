"use client";

import React, { useState } from "react";
import ComplianceSearch from "./ComplianceSearch";
import ComplianceFilters from "./ComplianceFilters";
import ComplianceTable from "./ComplianceTable";

interface Building {
  id: string;
  name: string;
  location: string;
  compliance: string;
  pm: string;
  annualFlatDoor: { date: string; status: string };
  asbestosReinspections: { date: string; status: string };
  asbestosSurveys: { date: string; status: string };
  fireAlarmTesting: { date: string; status: string };
  fireRiskAssessment: { date: string; status: string };
  hsMonthlyVisit: { date: string; status: string };
  hsRiskAssessment: { date: string; status: string };
  legionellaRisk: { date: string; status: string };
}

interface ComplianceOverviewProps {
  initialBuildings: Building[];
  tenant: string;
}

export default function ComplianceOverview({
  initialBuildings,
}: ComplianceOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    activeOnly: true,
    hampstead: true,
    ealing: true,
    camden: true,
    leased: true,
    archived: false,
    complex: false,
  });
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [roomUse, setRoomUse] = useState("Room Use");
  const [buildingManagers, setBuildingManagers] = useState("Building Managers");

  const filteredBuildings = initialBuildings.filter((building) => {
    if (
      searchTerm &&
      !building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !building.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-6">
        <div className="w-full md:w-64">
          <ComplianceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <ComplianceFilters
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          buildingUse={buildingUse}
          setBuildingUse={setBuildingUse}
          roomUse={roomUse}
          setRoomUse={setRoomUse}
          buildingManagers={buildingManagers}
          setBuildingManagers={setBuildingManagers}
        />
      </div>

      <ComplianceTable data={filteredBuildings} searchTerm={searchTerm} />

      <div className="text-sm text-gray-600 mt-4">961 tasks</div>
    </>
  );
}