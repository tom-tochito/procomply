import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  onAdd: () => void;
  addButtonText?: string;
}

export default function PageHeader({ title, breadcrumb, onAdd, addButtonText = "Add New" }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>{breadcrumb}</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#F30] text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <Plus className="mr-2" size={20} />
          {addButtonText}
        </button>
      </div>
    </div>
  );
}