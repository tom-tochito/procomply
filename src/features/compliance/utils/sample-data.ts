"use server";

import { 
  createComplianceCheck 
} from "../repository/compliance.repository";
import { 
  COMPLIANCE_CHECK_TYPES, 
  COMPLIANCE_STATUS,
  ComplianceCheckType,
  ComplianceStatus
} from "../models";

interface SampleCheckData {
  type: ComplianceCheckType;
  status: ComplianceStatus;
  daysFromNow: number;
  completedDaysAgo?: number;
}

export async function generateSampleComplianceData(buildingId: string, tenantId: string) {
  const sampleChecks: SampleCheckData[] = [
    {
      type: COMPLIANCE_CHECK_TYPES.FIRE_RISK_ASSESSMENT,
      status: COMPLIANCE_STATUS.SUCCESS,
      daysFromNow: 365,
      completedDaysAgo: 30
    },
    {
      type: COMPLIANCE_CHECK_TYPES.ASBESTOS_SURVEYS,
      status: COMPLIANCE_STATUS.SUCCESS,
      daysFromNow: 730,
      completedDaysAgo: 180
    },
    {
      type: COMPLIANCE_CHECK_TYPES.LEGIONELLA_RISK,
      status: COMPLIANCE_STATUS.WARNING,
      daysFromNow: 30,
    },
    {
      type: COMPLIANCE_CHECK_TYPES.ANNUAL_FLAT_DOOR,
      status: COMPLIANCE_STATUS.OVERDUE,
      daysFromNow: -15,
    },
    {
      type: COMPLIANCE_CHECK_TYPES.FIRE_ALARM_TESTING,
      status: COMPLIANCE_STATUS.PENDING,
      daysFromNow: 90,
    },
  ];

  for (const check of sampleChecks) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + check.daysFromNow);

    let completedDate: Date | undefined;
    if (check.completedDaysAgo) {
      completedDate = new Date();
      completedDate.setDate(completedDate.getDate() - check.completedDaysAgo);
    }

    await createComplianceCheck(
      buildingId,
      tenantId,
      check.type,
      check.status,
      dueDate,
      completedDate,
      `Sample ${check.type} check`
    );
  }
}

export async function generateComplianceDataForAllBuildings(buildings: { id: string }[], tenantId: string) {
  for (const building of buildings) {
    // Generate random compliance data for each building
    const checkTypes = Object.values(COMPLIANCE_CHECK_TYPES);
    const statuses = Object.values(COMPLIANCE_STATUS);
    
    // Generate 3-6 random checks per building
    const numChecks = Math.floor(Math.random() * 4) + 3;
    const selectedTypes = checkTypes.sort(() => 0.5 - Math.random()).slice(0, numChecks);
    
    for (const checkType of selectedTypes) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const daysFromNow = Math.floor(Math.random() * 365) - 180; // -180 to +185 days
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysFromNow);
      
      let completedDate: Date | undefined;
      if (randomStatus === COMPLIANCE_STATUS.SUCCESS) {
        completedDate = new Date();
        completedDate.setDate(completedDate.getDate() - Math.floor(Math.random() * 180));
      }
      
      await createComplianceCheck(
        building.id,
        tenantId,
        checkType,
        randomStatus,
        dueDate,
        completedDate
      );
    }
  }
}