// Define types for tasks
export type Task = {
  id: string;
  description: string;
  riskArea: string;
  priority: "H" | "M" | "L"; // High, Medium, Low
  riskLevel: "H" | "M" | "L"; // High, Medium, Low
  dueDate: string;
  team: string;
  assignee?: string;
  progress?: string;
  latestNote?: string;
  groups?: string[];
  completed?: boolean;
  buildingId: string;
};

// Sample task data
export const tasks: Task[] = [
  {
    id: "1",
    description: "ALL Fire Door Survey (inc flats) (1Y)",
    riskArea: "Fire",
    priority: "H",
    riskLevel: "H",
    dueDate: "30/04/2024",
    team: "ASAP Comply Ltd",
    assignee: "",
    progress: "",
    buildingId: "40001",
  },
  {
    id: "2",
    description: "Quarterly Communal Fire Door Inspections",
    riskArea: "Fire",
    priority: "H",
    riskLevel: "H",
    dueDate: "22/01/2025",
    team: "ASAP Comply Ltd",
    assignee: "Mark Burchall (ASAP)",
    progress: "Job Started",
    buildingId: "40001",
  },
  {
    id: "3",
    description: "Fire Alarm Testing",
    riskArea: "Fire",
    priority: "H",
    riskLevel: "H",
    dueDate: "15/05/2024",
    team: "ASAP Comply Ltd",
    assignee: "John Smith",
    progress: "In Progress",
    buildingId: "40003",
  },
  {
    id: "4",
    description: "Asbestos Reinspection",
    riskArea: "Asbestos",
    priority: "H",
    riskLevel: "H",
    dueDate: "21/02/2024",
    team: "ASAP Comply Ltd",
    completed: true,
    buildingId: "40001",
  },
  {
    id: "5",
    description: "Legionella Risk Assessment",
    riskArea: "Water",
    priority: "M",
    riskLevel: "M",
    dueDate: "15/06/2024",
    team: "ASAP Comply Ltd",
    assignee: "Jane Doe",
    progress: "Scheduled",
    buildingId: "40001",
  },
];

// Helper function to get tasks by building ID
export const getTasksByBuildingId = (buildingId: string): Task[] => {
  return tasks.filter((task) => task.buildingId === buildingId);
};
