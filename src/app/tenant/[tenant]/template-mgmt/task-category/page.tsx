import Header from "@/common/components/Header/Header";
import TaskCategoryManagement from "@/features/template-mgmt/components/TaskCategoryManagement";
import { initialTaskCategories } from "@/data/template-mgmt/taskCategories";

interface TaskCategoryPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TaskCategoryPage({ params }: TaskCategoryPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskCategoryManagement initialCategories={initialTaskCategories} />
      </div>
    </div>
  );
}