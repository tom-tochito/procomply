import SurveyTypeManagement from "@/features/template-mgmt/components/SurveyTypeManagement";
import { initialSurveyTypes } from "@/data/template-mgmt/surveyTypes";

interface SurveyTypePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function SurveyTypePage({ params }: SurveyTypePageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SurveyTypeManagement initialSurveyTypes={initialSurveyTypes} />
      </div>
    </div>
  );
}