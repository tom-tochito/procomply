import { requireAuth } from "@/features/auth";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";
import DocumentTemplateManagement from "@/features/templates/components/DocumentTemplateManagement";

interface DocumentTypeTemplatePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function DocumentTypeTemplatePage({ params }: DocumentTypeTemplatePageProps) {
  const { tenant: tenantSlug } = await params;

  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await requireAuth(tenant);

  return <DocumentTemplateManagement tenant={tenant} />;
}