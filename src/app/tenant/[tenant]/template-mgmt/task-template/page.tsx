import Header from "@/common/components/Header/Header";
import TaskTemplateManagement from "@/features/template-mgmt/components/TaskTemplateManagement";
import { initialTaskTemplates } from "@/data/template-mgmt/taskTemplates";

interface TaskTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TaskTemplatePage({ params }: TaskTemplatePageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskTemplateManagement initialTemplates={initialTaskTemplates} />
      </div>
    </div>
  );
}