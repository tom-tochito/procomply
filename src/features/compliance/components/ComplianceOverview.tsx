"use client";

import React, { useState, useEffect } from "react";
import ComplianceSearch from "./ComplianceSearch";
import ComplianceDynamicFilters from "./ComplianceDynamicFilters";
import ComplianceTable from "./ComplianceTable";
import type { Tenant } from "@/features/tenant/models";

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

interface Division {
  id: string;
  name: string;
  type: string;
}

interface ComplianceOverviewProps {
  initialBuildings: Building[];
  tenant: Tenant;
  divisions?: Division[];
}

export default function ComplianceOverview({
  initialBuildings,
  tenant,
  divisions = [],
}: ComplianceOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [roomUse, setRoomUse] = useState("Room Use");
  const [buildingManagers, setBuildingManagers] = useState("Building Managers");
  
  // Initialize selected divisions to all active divisions
  useEffect(() => {
    const activeDivisions = divisions.filter(d => d.type === "Active");
    setSelectedDivisions(activeDivisions.map(d => d.id));
  }, [divisions]);

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

        <ComplianceDynamicFilters
          divisions={divisions}
          selectedDivisions={selectedDivisions}
          setSelectedDivisions={setSelectedDivisions}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          buildingUse={buildingUse}
          setBuildingUse={setBuildingUse}
          roomUse={roomUse}
          setRoomUse={setRoomUse}
          buildingManagers={buildingManagers}
          setBuildingManagers={setBuildingManagers}
        />
      </div>

      <ComplianceTable 
        data={filteredBuildings} 
        searchTerm={searchTerm} 
        tenant={tenant}
      />
    </>
  );
}