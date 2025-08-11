/**
 * @deprecated This repository pattern is not used in this application.
 * Use Convex queries and mutations directly instead.
 */

export function getCompanyById(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.companies.get"
  );
}

export function createCompany(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.companies.create"
  );
}

export function updateCompany(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.companies.update"
  );
}

export function deleteCompany(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.companies.delete"
  );
}

export function listCompanies(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.companies.list"
  );
}

export function listCompaniesByUser(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.companies.listByUser"
  );
}

export function getCompaniesByTenant(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.companies.listByTenant"
  );
}