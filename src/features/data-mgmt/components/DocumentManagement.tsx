"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import UploadDocumentDialog from "./UploadDocumentDialog";
import DocumentTable from "@/features/documents/components/DocumentTable";
import DocumentViewer from "@/features/documents/components/DocumentViewer";
import DocumentSidebar from "./DocumentSidebar";
import DocumentActionBar from "./DocumentActionBar";
import { Tenant } from "@/features/tenant/models";
import { getFileUrl } from "@/common/utils/file";
import { Document } from "@/features/documents/models";
import { toast } from "sonner";
import { Id } from "~/convex/_generated/dataModel";

// Type for documents with simplified relations as returned by the query
type DocumentWithSimplifiedRelations = Document & {
  building?: { _id: Id<"buildings">; name: string };
  uploader?: { _id: Id<"users">; email?: string };
};

interface DocumentManagementProps {
  tenant: Tenant;
}

export default function DocumentManagement({
  tenant,
}: DocumentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedStatutory, setSelectedStatutory] = useState<boolean | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithSimplifiedRelations | null>(null);

  // Fetch buildings and divisions
  const buildings = useQuery(api.buildings.getBuildings, {}) || [];
  const divisions = useQuery(api.divisions.getDivisions, {}) || [];
  
  // Fetch documents from Convex
  const documents = useQuery(api.documents.getDocuments, {
    buildingId: selectedBuilding ? selectedBuilding as Id<"buildings"> : undefined,
  }) || [];

  const deleteDocument = useMutation(api.documents.deleteDocument);

  // Extract unique categories and file types from documents
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    documents.forEach(doc => {
      if (doc.category) uniqueCategories.add(doc.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [documents]);

  const fileTypes = useMemo(() => {
    const uniqueFileTypes = new Set<string>();
    documents.forEach(doc => {
      if (doc.type) uniqueFileTypes.add(doc.type);
    });
    return Array.from(uniqueFileTypes).sort();
  }, [documents]);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter - based on document state and expiry
    const matchesStatus = !selectedStatus || 
      (selectedStatus === "Active" && doc.isActive !== false) ||
      (selectedStatus === "Archived" && doc.isActive === false) ||
      (selectedStatus === "Pending" && doc.isActive !== false && doc.expiryDate && doc.expiryDate > Date.now());
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    const matchesFileType = !selectedFileType || doc.type === selectedFileType;
    const matchesStatutory = selectedStatutory === null || doc.isStatutory === selectedStatutory;
    
    // Division filter - check if document's building belongs to selected division
    let matchesDivision = true;
    if (selectedDivision && doc.buildingId) {
      const building = buildings.find(b => b._id === doc.buildingId);
      const division = divisions.find(d => d.name === selectedDivision);
      matchesDivision = building?.divisionId === division?._id;
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesFileType && matchesStatutory && matchesDivision;
  });

  const getFileUrl = (tenantSlug: string, path: string) => {
    return `/api/files/${path}`;
  };

  const handleView = (document: DocumentWithSimplifiedRelations) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDownload = (document: DocumentWithSimplifiedRelations) => {
    if (document.path) {
      const downloadUrl = getFileUrl(tenant.slug, document.path);
      window.open(downloadUrl, "_blank");
    } else {
      alert("File path not available");
    }
  };

  const handleDelete = async (document: DocumentWithSimplifiedRelations) => {
    try {
      await deleteDocument({ documentId: document._id });
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <DocumentSidebar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFileType={selectedFileType}
        setSelectedFileType={setSelectedFileType}
        selectedStatutory={selectedStatutory}
        setSelectedStatutory={setSelectedStatutory}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        categories={categories}
        fileTypes={fileTypes}
        buildings={buildings.map(b => ({ id: b._id, name: b.name }))}
        divisions={divisions.map(d => d.name)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Action Bar */}
        <DocumentActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onUploadClick={() => setUploadDialogOpen(true)}
          documentCount={filteredDocuments.length}
        />

        {/* Documents Table */}
        <div className="flex-1 overflow-auto">
          <DocumentTable
            documents={filteredDocuments as any}
            onRowClick={handleView}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        tenant={tenant}
      />

      {/* Document Viewer */}
      {selectedDocument && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument as any}
          tenantSlug={tenant.slug}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}