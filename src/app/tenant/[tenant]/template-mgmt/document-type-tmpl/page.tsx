import Header from "@/common/components/Header/Header";
import DocumentTypeTemplateManagement from "@/features/template-mgmt/components/DocumentTypeTemplateManagement";
import { initialDocumentTypeTemplates } from "@/data/template-mgmt/documentTypeTemplates";

interface DocumentTypeTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function DocumentTypeTemplatePage({ params }: DocumentTypeTemplatePageProps) {
  await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentTypeTemplateManagement initialTemplates={initialDocumentTypeTemplates} />
      </div>
    </div>
  );
}