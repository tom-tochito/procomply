import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-[#F30]/10 text-[#F30] rounded-md hover:bg-[#F30]/20 transition-colors text-sm font-medium text-center">
          Add New Task
        </button>
        <button className="p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium text-center">
          Generate Report
        </button>
        <Link
          href="/buildings"
          className="p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium text-center"
        >
          Add Property
        </Link>
        <button className="p-3 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors text-sm font-medium text-center">
          View Calendar
        </button>
      </div>
    </div>
  );
}