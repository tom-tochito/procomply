"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
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

  // Fetch buildings, tasks, compliance checks, and divisions separately
  const buildings = useQuery(api.buildings.getBuildings, { tenantId: tenant._id }) || [];
  const divisions = useQuery(api.divisions.getDivisions, { tenantId: tenant._id }) || [];
  const allTasks = useQuery(api.tasks.getTasks, {}) || [];
  const allComplianceChecks = useQuery(api.complianceChecks.getComplianceChecks, {}) || [];
  
  const buildingsLoading = buildings === undefined || divisions === undefined || 
                          allTasks === undefined || allComplianceChecks === undefined;

  // Initialize selected divisions to all active divisions
  useEffect(() => {
    const activeDivisions = divisions.filter(d => d.type === "Active");
    setSelectedDivisions(activeDivisions.map(d => d._id));
  }, [divisions]);

  // Transform buildings to match the component's expected format
  const formattedBuildings = useMemo(() => {
    return buildings.map(building => {
      // Get tasks for this building
      const buildingTasks = allTasks.filter(task => task.buildingId === building._id);
      const buildingComplianceChecks = allComplianceChecks.filter(check => check.buildingId === building._id);
      
      // Calculate task-based compliance
      const totalTasks = buildingTasks.length;
      const completedTasks = buildingTasks.filter(task => task.status === "completed").length;
      const taskCompliance = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 100;

      // Group compliance checks by type and get the most recent one
      const checksByType: Record<string, { completedDate?: number; dueDate?: number; status?: string }> = {};
      
      buildingComplianceChecks.forEach(check => {
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
      const compliance = buildingComplianceChecks.length > 0 ? checkCompliance : taskCompliance;

      return {
        id: building._id,
        name: building.name,
        location: building.divisionId || "",
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
  }, [buildings, allTasks, allComplianceChecks]);

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
          divisions={divisions.map(d => ({ id: d._id, name: d.name, type: d.type }))}
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