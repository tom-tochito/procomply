import Link from "next/link";
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

type ComplianceCheck = InstaQLEntity<AppSchema, "complianceChecks", { building: {} }>;

interface ComplianceStatusProps {
  complianceChecks: ComplianceCheck[];
  tenant: string;
}

export default function ComplianceStatus({ complianceChecks, tenant }: ComplianceStatusProps) {
  // Group compliance checks by status
  const statusCounts = complianceChecks.reduce((acc, check) => {
    acc[check.status] = (acc[check.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalChecks = complianceChecks.length;
  const overdueChecks = complianceChecks.filter(
    check => check.status === "overdue" || 
    (check.status === "pending" && check.dueDate && new Date(check.dueDate) < new Date())
  ).length;

  const statusColors = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    pending: "bg-gray-100 text-gray-800"
  };

  const checkTypes = [
    { key: "annualFlatDoor", label: "Annual Flat Door", icon: "🚪" },
    { key: "asbestosReinspections", label: "Asbestos Reinspections", icon: "⚠️" },
    { key: "fireRiskAssessment", label: "Fire Risk Assessment", icon: "🔥" },
    { key: "electricalTesting", label: "Electrical Testing", icon: "⚡" },
    { key: "gasCompliance", label: "Gas Compliance", icon: "🔧" }
  ];

  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <h3 className="font-bold text-lg text-gray-800">
          Compliance Status
        </h3>
        <Link
          href={`/tenant/${tenant}/compliance-overview`}
          className="text-sm text-[#F30] hover:underline"
        >
          View Details
        </Link>
      </div>
      
      {/* Overall Status Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-600">Total Checks</p>
          <p className="text-xl font-bold text-gray-900">{totalChecks}</p>
        </div>
        <div className={`p-3 rounded-md ${overdueChecks > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-xs text-gray-600">Overdue</p>
          <p className={`text-xl font-bold ${overdueChecks > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {overdueChecks}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-sm font-medium text-gray-700">{count}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t">
        <Link
          href={`/tenant/${tenant}/compliance-overview`}
          className="block w-full text-center text-sm bg-[#F30] text-white py-2 rounded-md hover:bg-[#F30]/90 transition-colors"
        >
          View Compliance Dashboard
        </Link>
      </div>
    </div>
  );
}