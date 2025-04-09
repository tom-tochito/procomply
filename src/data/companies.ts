// Define types for companies
export type Company = {
  id: string;
  name: string;
  category?: string;
  ref?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  numberOfEmployees?: number;
};

// Sample company data based on the screenshots
export const companies: Company[] = [
  {
    id: "1",
    name: "Akelius",
    ref: "Akelius",
  },
  {
    id: "2",
    name: "Akelius Residential Ltd",
    ref: "Akelius Residential Ltd",
  },
  {
    id: "3",
    name: "ASAP Comply",
    ref: "ASAP Comply",
  },
  {
    id: "4",
    name: "Property Fire Protection",
    ref: "PFP",
  },
  {
    id: "5",
    name: "UK Five Ltd",
    ref: "UK Five Ltd",
  },
  {
    id: "6",
    name: "UK Four Ltd",
    ref: "UK Four Ltd",
  },
  {
    id: "7",
    name: "UK Nine Ltd",
    ref: "UK Nine Ltd",
  },
  {
    id: "8",
    name: "UK One Ltd",
    ref: "UK One Ltd",
  },
  {
    id: "9",
    name: "UK Seven Ltd",
    ref: "UK Seven Ltd",
  },
  {
    id: "10",
    name: "UK Thirteen Ltd",
    ref: "UK Thirteen Ltd",
  },
  {
    id: "11",
    name: "UK Three Ltd",
    ref: "UK Three Ltd",
  },
];
