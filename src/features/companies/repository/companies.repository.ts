"use server";

import { id } from "@instantdb/admin";
import { dbAdmin } from "~/lib/db-admin";
import { getAuthCookies } from "@/features/auth/repository/auth.repository";
import type { FullUser } from "@/features/user/repository/user.repository";
import type { CompanyWithTenant, CompanyWithRelations } from "@/features/companies/models";
import type { Tenant } from "@/features/tenant/models";

async function validateUserAccess(
  tenant: Tenant,
  user: FullUser
): Promise<void> {
  const isAdmin = user.profile?.role === "admin";
  const belongsToTenant = user.tenant?.id === tenant.id;

  if (!isAdmin && !belongsToTenant) {
    throw new Error("Unauthorized: User must be admin or belong to tenant");
  }
}

export async function createCompany(
  tenant: Tenant,
  data: {
    name: string;
    referral: string;
    category?: string;
    email?: string;
    phone?: string;
    postcode?: string;
    numberOfEmployees?: number;
  }
): Promise<string> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const companyId = id();
  const now = Date.now();

  await dbAdmin.transact([
    dbAdmin.tx.companies[companyId]
      .update({
        name: data.name,
        referral: data.referral,
        ...(data.category && { category: data.category }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.postcode && { postcode: data.postcode }),
        ...(data.numberOfEmployees && { numberOfEmployees: data.numberOfEmployees }),
        createdAt: now,
        updatedAt: now,
      })
      .link({ tenant: tenant.id }),
  ]);

  return companyId;
}

export async function updateCompany(
  companyId: string,
  data: Partial<{
    name: string;
    referral: string;
    category: string;
    email: string;
    phone: string;
    postcode: string;
    numberOfEmployees: number;
  }>
): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get company with tenant to validate access
  const companyResult = await dbAdmin.query({
    companies: {
      $: {
        where: { id: companyId },
      },
      tenant: {},
    },
  });

  const company = companyResult.companies[0];
  if (!company) throw new Error("Company not found");
  if (!company.tenant) throw new Error("Company has no tenant");

  await validateUserAccess(company.tenant, auth.user);

  await dbAdmin.transact([
    dbAdmin.tx.companies[companyId].update({
      ...data,
      updatedAt: Date.now(),
    }),
  ]);
}

export async function deleteCompany(companyId: string): Promise<void> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  // Get company with tenant to validate access
  const companyResult = await dbAdmin.query({
    companies: {
      $: {
        where: { id: companyId },
      },
      tenant: {},
    },
  });

  const company = companyResult.companies[0];
  if (!company) throw new Error("Company not found");
  if (!company.tenant) throw new Error("Company has no tenant");

  await validateUserAccess(company.tenant, auth.user);

  await dbAdmin.transact([dbAdmin.tx.companies[companyId].delete()]);
}

export async function getCompaniesByTenant(
  tenant: Tenant
): Promise<CompanyWithTenant[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  const result = await dbAdmin.query({
    companies: {
      $: {
        where: { "tenant.id": tenant.id },
        order: { createdAt: "desc" },
      },
      tenant: {},
    },
  });

  return result.companies;
}

export async function getCompanyById(
  companyId: string
): Promise<CompanyWithRelations | null> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  const result = await dbAdmin.query({
    companies: {
      $: {
        where: { id: companyId },
      },
      tenant: {},
      teams: {},
      employees: {},
    },
  });

  const company = result.companies[0];
  if (!company) return null;
  if (!company.tenant) throw new Error("Company has no tenant");

  await validateUserAccess(company.tenant, auth.user);

  return company;
}

export async function searchCompanies(
  tenant: Tenant,
  query: string
): Promise<CompanyWithTenant[]> {
  const auth = await getAuthCookies();
  if (!auth) throw new Error("Unauthorized");

  await validateUserAccess(tenant, auth.user);

  // Search by name or referral
  const searchPattern = `%${query}%`;

  const result = await dbAdmin.query({
    companies: {
      $: {
        where: {
          and: [
            { "tenant.id": tenant.id },
            {
              or: [
                { name: { $ilike: searchPattern } },
                { referral: { $ilike: searchPattern } },
              ],
            },
          ],
        },
        order: { createdAt: "desc" },
      },
      tenant: {},
    },
  });

  return (result.companies || []) as CompanyWithTenant[];
}