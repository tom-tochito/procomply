"use server";

import { dbAdmin } from "~/lib/db-admin";
import { id } from "@instantdb/admin";
import { 
  BuildingWithComplianceChecks, 
  ComplianceCheck,
  ComplianceCheckType, 
  ComplianceStatus,
  COMPLIANCE_CHECK_TYPES,
  ComplianceOverviewBuilding
} from "../models";
import { toTimestamp } from "@/common/utils/date";

export async function getBuildingsWithComplianceData(tenantId: string) {
  const query = await dbAdmin.query({
    buildings: {
      $: {
        where: {
          "tenant.id": tenantId,
          archived: false
        }
      },
      complianceChecks: {}
    }
  });

  const buildings = query.buildings as BuildingWithComplianceChecks[];
  
  // Transform buildings to include compliance percentage and organized checks
  const buildingsWithCompliance: ComplianceOverviewBuilding[] = buildings.map(building => {
    const checksByType: Record<string, ComplianceCheck | undefined> = {};
    let completedChecks = 0;
    const totalCheckTypes = Object.keys(COMPLIANCE_CHECK_TYPES).length;

    // Get the most recent check for each type
    Object.values(COMPLIANCE_CHECK_TYPES).forEach(checkType => {
      const checksOfType = building.complianceChecks
        ?.filter(check => check.checkType === checkType)
        .sort((a, b) => b.createdAt - a.createdAt);
      
      if (checksOfType && checksOfType.length > 0) {
        checksByType[checkType] = checksOfType[0];
        if (checksOfType[0].status === "success") {
          completedChecks++;
        }
      }
    });

    const compliancePercentage = Math.round((completedChecks / totalCheckTypes) * 100);

    return {
      ...building,
      compliance: compliancePercentage,
      complianceChecksByType: checksByType
    };
  });

  return buildingsWithCompliance;
}

export async function createComplianceCheck(
  buildingId: string,
  tenantId: string,
  checkType: ComplianceCheckType,
  status: ComplianceStatus,
  dueDate: Date,
  completedDate?: Date,
  notes?: string
) {
  const checkId = id();
  const now = Date.now();

  await dbAdmin.transact([
    dbAdmin.tx.complianceChecks[checkId]
      .update({
        checkType,
        status,
        dueDate: toTimestamp(dueDate),
        completedDate: completedDate ? toTimestamp(completedDate) : undefined,
        notes,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        building: buildingId,
        tenant: tenantId
      })
  ]);

  return checkId;
}

export async function updateComplianceCheck(
  checkId: string,
  updates: {
    status?: ComplianceStatus;
    completedDate?: Date;
    dueDate?: Date;
    notes?: string;
  }
) {
  const updateData: Record<string, string | number | undefined> = {
    updatedAt: Date.now()
  };

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.completedDate !== undefined) updateData.completedDate = toTimestamp(updates.completedDate);
  if (updates.dueDate !== undefined) updateData.dueDate = toTimestamp(updates.dueDate);
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  await dbAdmin.transact([
    dbAdmin.tx.complianceChecks[checkId].update(updateData)
  ]);
}

export async function getComplianceChecksByBuilding(buildingId: string) {
  const query = await dbAdmin.query({
    complianceChecks: {
      $: {
        where: {
          "building.id": buildingId
        },
        order: {
          createdAt: "desc"
        }
      }
    }
  });

  return query.complianceChecks;
}

export async function getUpcomingComplianceChecks(tenantId: string, daysAhead: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const query = await dbAdmin.query({
    complianceChecks: {
      $: {
        where: {
          "tenant.id": tenantId,
          dueDate: { $lte: toTimestamp(futureDate) },
          status: { $not: "success" }
        },
        order: {
          dueDate: "asc"
        }
      },
      building: {}
    }
  });

  return query.complianceChecks;
}