export type Task = {
  id: string;
  description: string;
  risk_area: string;
  priority: "H" | "M" | "L";
  risk_level: "H" | "M" | "L";
  due_date: string;
  team: string;
  assignee: string;
  progress: string;
  notes: string[];
  groups: string[];
  completed: boolean;
  building_id: string;
};

export const tasks: Task[] = [
  {
    id: "1",
    description: "ALL Fire Door Survey (inc flats) (1Y)",
    risk_area: "Fire",
    priority: "H",
    risk_level: "H",
    due_date: "30/04/2024",
    team: "ASAP Comply Ltd",
    assignee: "",
    progress: "",
    notes: [],
    completed: false,
    groups: [],
    building_id: "40001",
  },
  {
    id: "2",
    description: "Quarterly Communal Fire Door Inspections",
    risk_area: "Fire",
    priority: "H",
    risk_level: "H",
    due_date: "22/01/2025",
    team: "ASAP Comply Ltd",
    assignee: "Mark Burchall (ASAP)",
    progress: "Job Started",
    notes: [],
    completed: false,
    groups: [],
    building_id: "40001",
  },
  {
    id: "3",
    description: "Fire Alarm Testing",
    risk_area: "Fire",
    priority: "H",
    risk_level: "H",
    due_date: "15/05/2024",
    team: "ASAP Comply Ltd",
    assignee: "John Smith",
    progress: "In Progress",
    notes: [],
    completed: false,
    groups: [],
    building_id: "40003",
  },
  {
    id: "4",
    description: "Asbestos Reinspection",
    risk_area: "Asbestos",
    priority: "H",
    risk_level: "H",
    due_date: "21/02/2024",
    team: "ASAP Comply Ltd",
    assignee: "",
    progress: "",
    notes: [],
    completed: true,
    groups: [],
    building_id: "40001",
  },
  {
    id: "5",
    description: "Legionella Risk Assessment",
    risk_area: "Water",
    priority: "M",
    risk_level: "M",
    due_date: "15/06/2024",
    team: "ASAP Comply Ltd",
    assignee: "Jane Doe",
    progress: "Scheduled",
    notes: [],
    completed: false,
    groups: [],
    building_id: "40001",
  },
];

// Helper function to get tasks by building ID
export const getTasksByBuildingId = (buildingId: string): Task[] => {
  return tasks.filter((task) => task.building_id === buildingId);
};
