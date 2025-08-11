import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";

export async function getTenantBySlug(slug: string) {
  try {
    const tenant = await fetchQuery(api.tenants.getTenantBySlug, { slug });
    return tenant;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    redirect("/");
  }
}