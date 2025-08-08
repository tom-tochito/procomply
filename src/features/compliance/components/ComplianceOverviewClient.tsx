"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db } from "~/lib/db";
import ComplianceSearch from "./ComplianceSearch";
import ComplianceDynamicFilters from "./ComplianceDynamicFilters";
import ComplianceTable from "./ComplianceTable";
import type { Tenant } from "@/features/tenant/models";
import { COMPLIANCE_CHECK_TYPES } from "@/features/compliance/models";

interface ComplianceOverviewClientProps {
  tenant: Tenant;
}

export default function ComplianceOverviewClient({
  tenant,
}: ComplianceOverviewClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [buildingUse, setBuildingUse] = useState("Building Use");
  const [roomUse, setRoomUse] = useState("Room Use");
  const [buildingManagers, setBuildingManagers] = useState("Building Managers");

  // Fetch buildings with tasks and compliance checks
  const { data: buildingsData, isLoading: buildingsLoading } = db.useQuery({
    buildings: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { name: "asc" },
      },
      tasks: {},
      complianceChecks: {},
      divisionEntity: {},
    },
  });

  // Fetch divisions
  const { data: divisionsData } = db.useQuery({
    divisions: {
      $: {
        where: { "tenant.id": tenant.id },
      },
    },
  });

  const divisions = useMemo(() => divisionsData?.divisions || [], [divisionsData?.divisions]);
  const buildings = useMemo(() => buildingsData?.buildings || [], [buildingsData?.buildings]);

  // Initialize selected divisions to all active divisions
  useEffect(() => {
    const activeDivisions = divisions.filter(d => d.type === "Active");
    setSelectedDivisions(activeDivisions.map(d => d.id));
  }, [divisions]);

  // Transform buildings to match the component's expected format
  const formattedBuildings = useMemo(() => {
    return buildings.map(building => {
      // Calculate task-based compliance
      const totalTasks = building.tasks?.length || 0;
      const completedTasks = building.tasks?.filter(task => task.status === "completed").length || 0;
      const taskCompliance = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 100;

      // Group compliance checks by type and get the most recent one
      const checksByType: Record<string, { completedDate?: number; dueDate?: number; status?: string }> = {};
      
      (building.complianceChecks || []).forEach(check => {
        if (!checksByType[check.checkType] || 
            (check.completedDate || check.dueDate || 0) > (checksByType[check.checkType].completedDate || checksByType[check.checkType].dueDate || 0)) {
          checksByType[check.checkType] = check;
        }
      });

      // Calculate compliance check-based compliance
      const totalCheckTypes = Object.keys(COMPLIANCE_CHECK_TYPES).length;
      const completedChecks = Object.values(checksByType).filter(
        check => check.status === "success"
      ).length;
      const checkCompliance = totalCheckTypes > 0 
        ? Math.round((completedChecks / totalCheckTypes) * 100) 
        : 0;

      // Use check-based compliance if available, otherwise use task-based
      const compliance = building.complianceChecks?.length > 0 ? checkCompliance : taskCompliance;

      return {
        id: building.id,
        name: building.name,
        location: building.division || "",
        compliance: `${compliance}%`,
        pm: "", // Property Manager - not in schema yet
        annualFlatDoor: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.ANNUAL_FLAT_DOOR]),
        asbestosReinspections: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.ASBESTOS_REINSPECTIONS]),
        asbestosSurveys: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.ASBESTOS_SURVEYS]),
        fireAlarmTesting: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.FIRE_ALARM_TESTING]),
        fireRiskAssessment: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.FIRE_RISK_ASSESSMENT]),
        hsMonthlyVisit: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.HS_MONTHLY_VISIT]),
        hsRiskAssessment: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.HS_RISK_ASSESSMENT]),
        legionellaRisk: formatComplianceCheck(checksByType[COMPLIANCE_CHECK_TYPES.LEGIONELLA_RISK]),
      };
    });
  }, [buildings]);

  const filteredBuildings = formattedBuildings.filter((building) => {
    if (
      searchTerm &&
      !building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !building.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (buildingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading compliance data...</div>
      </div>
    );
  }

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

function formatComplianceCheck(check: { completedDate?: number; dueDate?: number; status?: string } | undefined): { date: string; status: string } {
  if (!check) {
    return { date: "", status: "" };
  }
  
  const date = check.completedDate || check.dueDate;
  return {
    date: date ? new Date(date).toLocaleDateString("en-GB") : "",
    status: check.status || ""
  };
}