export type Document = {
  id: string;
  name: string;
  file_type: string;
  category: string;
  document_category: string;
  upload_date: string;
  uploaded_by: string;
  size: string;
  status: "Active" | "Archived" | "Pending";
  building_id: string;
  task_id: string;
  description: string;
  tags: string[];
  last_accessed: string;
  version: string;
};

// Sample document data
export const documents: Document[] = [
  {
    id: "doc-1",
    name: "Fire Safety Certificate.pdf",
    file_type: "PDF",
    category: "Certification",
    document_category: "Fire",
    upload_date: "15/04/2024",
    uploaded_by: "Mark Burchall",
    size: "2.4 MB",
    task_id: "1",
    status: "Active",
    building_id: "40001",
    description: "Annual fire safety certification for Fordwych Road property",
    tags: ["Fire", "Certification", "Annual"],
    last_accessed: "25/04/2024",
    version: "1.0",
  },
  {
    id: "doc-2",
    name: "Asbestos Survey Report.pdf",
    file_type: "PDF",
    category: "Survey",
    document_category: "Asbestos",
    upload_date: "10/03/2024",
    uploaded_by: "John Smith",
    size: "5.7 MB",
    task_id: "2",
    status: "Active",
    building_id: "40001",
    description: "Comprehensive asbestos survey and management plan",
    tags: ["Asbestos", "Survey", "Health & Safety"],
    last_accessed: "12/04/2024",
    version: "1.2",
  },
  {
    id: "doc-3",
    name: "Electrical Installation Certificate.pdf",
    file_type: "PDF",
    category: "Certification",
    document_category: "Electrical",
    upload_date: "22/02/2024",
    uploaded_by: "Jane Doe",
    size: "1.2 MB",
    task_id: "3",
    status: "Active",
    building_id: "40003",
    description: "Electrical safety certification following installation works",
    tags: ["Electrical", "Certification", "Installation"],
    last_accessed: "02/03/2024",
    version: "1.0",
  },
  {
    id: "doc-4",
    name: "Risk Assessment Template.docx",
    file_type: "DOCX",
    category: "Template",
    document_category: "Health and Safety",
    upload_date: "05/01/2024",
    uploaded_by: "Admin",
    building_id: "40001",
    size: "245 KB",
    task_id: "4",
    status: "Active",
    description: "Standard risk assessment template for all properties",
    tags: ["Template", "Risk Assessment", "Standard"],
    last_accessed: "10/04/2024",
    version: "2.1",
  },
  {
    id: "doc-5",
    name: "Monthly H&S Inspection Checklist.xlsx",
    file_type: "XLSX",
    category: "Checklist",
    document_category: "Health and Safety",
    upload_date: "18/03/2024",
    uploaded_by: "Mark Burchall",
    size: "320 KB",
    status: "Active",
    building_id: "40001",
    task_id: "5",
    description: "Monthly health and safety inspection checklist template",
    tags: ["Checklist", "H&S", "Monthly", "Inspection"],
    last_accessed: "01/05/2024",
    version: "1.3",
  },
  {
    id: "doc-6",
    name: "Fire Safety Management Plan.pdf",
    file_type: "PDF",
    category: "Management Plan",
    document_category: "Fire",
    upload_date: "14/12/2023",
    uploaded_by: "Jane Doe",
    size: "3.8 MB",
    status: "Active",
    building_id: "40001",
    task_id: "6",
    description: "Comprehensive fire safety management plan for the property",
    tags: ["Fire", "Management Plan", "Safety"],
    last_accessed: "22/02/2024",
    version: "1.1",
  },
  {
    id: "doc-7",
    name: "Previous Asbestos Report.pdf",
    file_type: "PDF",
    category: "Survey",
    document_category: "Asbestos",
    upload_date: "10/06/2023",
    uploaded_by: "Previous Contractor",
    size: "4.2 MB",
    status: "Archived",
    building_id: "40001",
    task_id: "7",
    description: "Previous asbestos survey (superseded by newer report)",
    tags: ["Asbestos", "Survey", "Health & Safety", "Archive"],
    last_accessed: "09/03/2024",
    version: "1.0",
  },
  {
    id: "doc-8",
    name: "Water Hygiene Risk Assessment.pdf",
    file_type: "PDF",
    category: "Risk Assessment",
    document_category: "Legionella",
    upload_date: "05/04/2024",
    uploaded_by: "John Smith",
    size: "4.1 MB",
    status: "Pending",
    building_id: "40003",
    task_id: "8",
    description: "Legionella and water hygiene risk assessment awaiting review",
    tags: ["Water", "Legionella", "Risk Assessment", "Pending"],
    last_accessed: "05/04/2024",
    version: "1.0",
  },
];

// Helper functions for document filtering
export const getDocumentsByBuildingId = (buildingId: string): Document[] => {
  return documents.filter((doc) => doc.building_id === buildingId);
};

export const getDocumentsByTaskId = (taskId: string): Document[] => {
  return documents.filter((doc) => doc.task_id === taskId);
};

export const getDocumentsByCategory = (category: string): Document[] => {
  return documents.filter((doc) => doc.category === category);
};

export const getDocumentsByDocCategory = (docCategory: string): Document[] => {
  return documents.filter((doc) => doc.document_category === docCategory);
};

export const getDocumentsByStatus = (
  status: "Active" | "Archived" | "Pending"
): Document[] => {
  return documents.filter((doc) => doc.status === status);
};
