// Define types for documents
export type Document = {
  id: string;
  name: string;
  fileType: string;
  category: string;
  uploadDate: string;
  uploadedBy: string;
  size: string;
  status: "Active" | "Archived" | "Pending";
  buildingId?: string;
  taskId?: string;
  description?: string;
  tags?: string[];
  lastAccessed?: string;
  version?: string;
};

// Sample document data
export const documents: Document[] = [
  {
    id: "doc-1",
    name: "Fire Safety Certificate.pdf",
    fileType: "PDF",
    category: "Certification",
    uploadDate: "15/04/2024",
    uploadedBy: "Mark Burchall",
    size: "2.4 MB",
    status: "Active",
    buildingId: "40001",
    description: "Annual fire safety certification for Fordwych Road property",
    tags: ["Fire", "Certification", "Annual"],
    lastAccessed: "25/04/2024",
    version: "1.0",
  },
  {
    id: "doc-2",
    name: "Asbestos Survey Report.pdf",
    fileType: "PDF",
    category: "Survey",
    uploadDate: "10/03/2024",
    uploadedBy: "John Smith",
    size: "5.7 MB",
    status: "Active",
    buildingId: "40001",
    description: "Comprehensive asbestos survey and management plan",
    tags: ["Asbestos", "Survey", "Health & Safety"],
    lastAccessed: "12/04/2024",
    version: "1.2",
  },
  {
    id: "doc-3",
    name: "Electrical Installation Certificate.pdf",
    fileType: "PDF",
    category: "Certification",
    uploadDate: "22/02/2024",
    uploadedBy: "Jane Doe",
    size: "1.2 MB",
    status: "Active",
    buildingId: "40003",
    description: "Electrical safety certification following installation works",
    tags: ["Electrical", "Certification", "Installation"],
    lastAccessed: "02/03/2024",
    version: "1.0",
  },
  {
    id: "doc-4",
    name: "Risk Assessment Template.docx",
    fileType: "DOCX",
    category: "Template",
    uploadDate: "05/01/2024",
    uploadedBy: "Admin",
    size: "245 KB",
    status: "Active",
    description: "Standard risk assessment template for all properties",
    tags: ["Template", "Risk Assessment", "Standard"],
    lastAccessed: "10/04/2024",
    version: "2.1",
  },
  {
    id: "doc-5",
    name: "Monthly H&S Inspection Checklist.xlsx",
    fileType: "XLSX",
    category: "Checklist",
    uploadDate: "18/03/2024",
    uploadedBy: "Mark Burchall",
    size: "320 KB",
    status: "Active",
    taskId: "5",
    description: "Monthly health and safety inspection checklist template",
    tags: ["Checklist", "H&S", "Monthly", "Inspection"],
    lastAccessed: "01/05/2024",
    version: "1.3",
  },
  {
    id: "doc-6",
    name: "Fire Safety Management Plan.pdf",
    fileType: "PDF",
    category: "Management Plan",
    uploadDate: "14/12/2023",
    uploadedBy: "Jane Doe",
    size: "3.8 MB",
    status: "Active",
    buildingId: "40001",
    description: "Comprehensive fire safety management plan for the property",
    tags: ["Fire", "Management Plan", "Safety"],
    lastAccessed: "22/02/2024",
    version: "1.1",
  },
  {
    id: "doc-7",
    name: "Previous Asbestos Report.pdf",
    fileType: "PDF",
    category: "Survey",
    uploadDate: "10/06/2023",
    uploadedBy: "Previous Contractor",
    size: "4.2 MB",
    status: "Archived",
    buildingId: "40001",
    description: "Previous asbestos survey (superseded by newer report)",
    tags: ["Asbestos", "Survey", "Health & Safety", "Archive"],
    lastAccessed: "09/03/2024",
    version: "1.0",
  },
  {
    id: "doc-8",
    name: "Water Hygiene Risk Assessment.pdf",
    fileType: "PDF",
    category: "Risk Assessment",
    uploadDate: "05/04/2024",
    uploadedBy: "John Smith",
    size: "4.1 MB",
    status: "Pending",
    buildingId: "40003",
    description: "Legionella and water hygiene risk assessment awaiting review",
    tags: ["Water", "Legionella", "Risk Assessment", "Pending"],
    lastAccessed: "05/04/2024",
    version: "1.0",
  },
];

// Helper functions for document filtering
export const getDocumentsByBuildingId = (buildingId: string): Document[] => {
  return documents.filter((doc) => doc.buildingId === buildingId);
};

export const getDocumentsByTaskId = (taskId: string): Document[] => {
  return documents.filter((doc) => doc.taskId === taskId);
};

export const getDocumentsByCategory = (category: string): Document[] => {
  return documents.filter((doc) => doc.category === category);
};

export const getDocumentsByStatus = (
  status: "Active" | "Archived" | "Pending"
): Document[] => {
  return documents.filter((doc) => doc.status === status);
};
