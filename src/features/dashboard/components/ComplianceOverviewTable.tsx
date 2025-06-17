import Link from "next/link";
import { generateTenantRedirectUrl } from "@/utils/tenant";

interface ComplianceOverviewTableProps {
  tenant: string;
}

export default function ComplianceOverviewTable({ tenant }: ComplianceOverviewTableProps) {
  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
        Compliance Overview
      </h3>
      <div className="responsive-table-container">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left font-semibold rounded-tl-md">
                Building
              </th>
              <th className="p-3 text-left font-semibold">Cpl %</th>
              <th className="p-3 text-left font-semibold">PM</th>
              <th className="p-3 text-left font-semibold">
                Annual Flat Door Inspection
              </th>
              <th className="p-3 text-left font-semibold">
                Asbestos Reinspections
              </th>
              <th className="p-3 text-left font-semibold">
                Asbestos Surveys
              </th>
              <th className="p-3 text-left font-semibold">
                Fire Alarm Testing
              </th>
              <th className="p-3 text-left font-semibold">
                Fire Risk Assessment
              </th>
              <th className="p-3 text-left font-semibold">
                H&S Monthly Visit Report
              </th>
              <th className="p-3 text-left font-semibold">
                H&S Risk Assessment
              </th>
              <th className="p-3 text-left font-semibold rounded-tr-md">
                Legionella Risk Assessment
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/buildings/40001"
                  )}
                  className="text-[#F30] hover:underline"
                >
                  40001 Viney Court
                </Link>
              </td>
              <td className="p-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  72%
                </span>
              </td>
              <td className="p-3">SW</td>
              <td className="p-3 text-green-600">30/04/2024</td>
              <td className="p-3 text-red-600">21/02/2018</td>
              <td className="p-3 text-red-600">14/06/2019</td>
              <td className="p-3 text-green-600">06/09/2024</td>
              <td className="p-3 text-red-600">01/06/2019</td>
              <td className="p-3 text-gray-400">--</td>
              <td className="p-3 text-gray-400">--</td>
              <td className="p-3 text-gray-400">--</td>
            </tr>
            <tr className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">
                <Link
                  href={generateTenantRedirectUrl(
                    tenant,
                    "/buildings/40002"
                  )}
                  className="text-[#F30] hover:underline"
                >
                  40002 Maple House
                </Link>
              </td>
              <td className="p-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  89%
                </span>
              </td>
              <td className="p-3">JD</td>
              <td className="p-3 text-green-600">15/05/2024</td>
              <td className="p-3 text-green-600">03/01/2024</td>
              <td className="p-3 text-green-600">22/03/2024</td>
              <td className="p-3 text-green-600">12/08/2024</td>
              <td className="p-3 text-green-600">18/04/2024</td>
              <td className="p-3 text-green-600">01/09/2024</td>
              <td className="p-3 text-gray-400">--</td>
              <td className="p-3 text-green-600">10/02/2024</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 text-sm gap-3">
        <div className="text-gray-500">Showing 2 of 4 properties</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md bg-[#F30] text-white hover:bg-[#F30]/90 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}