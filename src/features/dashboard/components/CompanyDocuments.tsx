export default function CompanyDocuments() {
  return (
    <div className="rounded-lg border p-4 md:p-5 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
        Company Documents
      </h3>
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-sm italic text-gray-500">
          No company documents available
        </p>
        <button className="mt-3 text-[#F30] border border-[#F30] px-4 py-2 rounded-md text-sm hover:bg-[#F30]/10 transition-colors">
          Upload Document
        </button>
      </div>
    </div>
  );
}