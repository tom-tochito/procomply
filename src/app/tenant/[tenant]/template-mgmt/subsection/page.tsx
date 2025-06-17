import SubsectionManagement from "@/features/template-mgmt/components/SubsectionManagement";
import { initialSubsections } from "@/data/template-mgmt/subsections";

interface SubsectionPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function SubsectionPage({ params }: SubsectionPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubsectionManagement initialSubsections={initialSubsections} />
      </div>
    </div>
  );
}