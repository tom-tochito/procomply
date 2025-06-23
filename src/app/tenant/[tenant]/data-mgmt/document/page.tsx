import Link from "next/link";
import { generateTenantRedirectUrl } from "~/src/features/tenant/utils/tenant.utils";
import DocumentManagement from "@/features/data-mgmt/components/DocumentManagement";
import { getDocumentsByTenant } from "@/features/documents/repository/documents.repository";
import { requireAuth } from "@/features/auth/repository/auth.repository";
import { findTenantBySlug } from "@/features/tenant/repository/tenant.repository";

interface DocumentPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { tenant } = await params;

  // Require authentication
  await requireAuth(tenant);

  // Get tenant data
  const tenantData = await findTenantBySlug(tenant);
  if (!tenantData) {
    throw new Error("Tenant not found");
  }

  // Fetch documents from InstantDB
  const documentsFromDB = await getDocumentsByTenant(tenantData);
  
  // Transform to match component expectations
  const documents = documentsFromDB.map((doc) => ({
    id: doc.id,
    name: doc.name,
    file_type: doc.type,
    category: doc.type, // Using type as category for now
    document_category: doc.type,
    upload_date: new Date(doc.uploadedAt).toLocaleDateString('en-GB'),
    uploaded_by: doc.uploader?.email || 'Unknown',
    size: `${(doc.size / 1024 / 1024).toFixed(1)} MB`,
    status: "Active" as const,
    building_id: doc.building?.id || '',
    task_id: '', // No task association in current schema
    description: '', // No description in current schema
    tags: [],
    last_accessed: new Date(doc.updatedAt).toLocaleDateString('en-GB'),
    version: '1.0',
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Documents
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link
              href={generateTenantRedirectUrl(tenant, "/dashboard")}
              className="hover:text-blue-600"
            >
              <span>Data Mgmt</span>
            </Link>
            <span className="mx-2">/</span>
            <span>Document</span>
          </div>
        </div>

        <DocumentManagement initialDocuments={documents} tenant={tenant} />
      </div>
    </div>
  );
}
