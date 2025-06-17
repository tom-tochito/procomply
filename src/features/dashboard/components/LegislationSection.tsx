export default function LegislationSection() {
  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
        Legislation
      </h3>
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-[#F30] hover:underline cursor-pointer flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          HSG264 - Asbestos The Survey Guide
        </p>
      </div>
    </div>
  );
}