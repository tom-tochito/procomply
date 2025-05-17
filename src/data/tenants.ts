interface Tenant {
  id: string;
  name: string;
}

export const TENANTS: Tenant[] = [
  { id: "akelius", name: "Akelius" },
  { id: "dawsongroup", name: "Dawson Group" },
  { id: "propertyserve", name: "Property Serve" },
  { id: "asap", name: "ASAP" },
  { id: "potens", name: "Potens" },
];
