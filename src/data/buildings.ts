export type Building = {
  id: string;
  name: string;
  image: string;
  division: string;
  status: string;
  compliance: number;
  inbox: {
    urgent: number;
    warning: number;
    email: boolean;
  };
};

export const buildings: Building[] = [
  {
    id: "40001",
    name: "Viney Court",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    division: "Camden",
    status: "Active",
    compliance: 72,
    inbox: { urgent: 1, warning: 1, email: false },
  },
  {
    id: "40003",
    name: "Westcott Park",
    image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
    division: "Leased",
    status: "Leasehold",
    compliance: 38,
    inbox: { urgent: 2, warning: 0, email: false },
  },
  {
    id: "40004",
    name: "Meredith Mews",
    image: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg",
    division: "Leased",
    status: "Leasehold",
    compliance: 75,
    inbox: { urgent: 0, warning: 0, email: true },
  },
  {
    id: "40005",
    name: "Lambert Court",
    image: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg",
    division: "Hampstead",
    status: "Active",
    compliance: 70,
    inbox: { urgent: 1, warning: 0, email: false },
  },
  {
    id: "40006",
    name: "Hillgate Place",
    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
    division: "Leased",
    status: "Leasehold",
    compliance: 85,
    inbox: { urgent: 0, warning: 0, email: true },
  },
];

// Helper function to get a building by ID
export const getBuildingById = (id: string): Building | undefined => {
  return buildings.find((building) => building.id === id);
};

// Filter options based on the screenshots
export const divisions = [
  "Active Divisions",
  "Hampstead",
  "Ealing",
  "Camden",
  "Leased",
  "Archived",
];
