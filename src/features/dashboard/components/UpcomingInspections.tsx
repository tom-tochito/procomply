import Link from "next/link";
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "~/instant.schema";

type Inspection = InstaQLEntity<AppSchema, "inspections", { building: object }>;

interface UpcomingInspectionsProps {
  inspections: Inspection[];
  tenant: string;
}

export default function UpcomingInspections({ inspections, tenant }: UpcomingInspectionsProps) {
  const upcomingInspections = inspections
    .filter(i => i.status === "scheduled" && i.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <h3 className="font-bold text-lg text-gray-800">
          Upcoming Inspections
        </h3>
        <Link
          href={`/tenant/${tenant}/data-mgmt/task`}
          className="text-sm text-[#F30] hover:underline"
        >
          View All
        </Link>
      </div>
      
      {upcomingInspections.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <p className="text-sm italic text-gray-500">
            No upcoming inspections scheduled
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingInspections.map((inspection) => (
            <div key={inspection.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{inspection.type}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {inspection.building?.name || "Unknown location"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#F30]">
                    {new Date(inspection.scheduledDate!).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short"
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.ceil(
                      (new Date(inspection.scheduledDate!).getTime() - new Date().getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )} days
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}