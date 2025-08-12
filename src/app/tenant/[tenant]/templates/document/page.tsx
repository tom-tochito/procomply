import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
// TODO: Migrate DocumentTemplateManagement from InstantDB to Convex
// import DocumentTemplateManagement from "@/features/templates/components/DocumentTemplateManagement";

interface DocumentTypeTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function DocumentTypeTemplatePage({ params }: DocumentTypeTemplatePageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }


  // TODO: Migrate DocumentTemplateManagement from InstantDB to Convex
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Document Templates</h1>
      <p className="text-gray-600">Document template management is currently being migrated to the new system.</p>
    </div>
  );
}