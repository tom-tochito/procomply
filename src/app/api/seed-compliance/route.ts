import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "~/lib/db-admin";
import { generateComplianceDataForAllBuildings } from "@/features/compliance/utils/sample-data";

export async function POST(request: NextRequest) {
  try {
    // Get tenant from request body
    const body = await request.json() as { tenantSlug?: string };
    const { tenantSlug } = body;
    
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });
    }

    // Find tenant
    const tenantQuery = await dbAdmin.query({
      tenants: {
        $: {
          where: { slug: tenantSlug }
        }
      }
    });

    const tenant = tenantQuery.tenants[0];
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get all buildings for this tenant
    const buildingsQuery = await dbAdmin.query({
      buildings: {
        $: {
          where: { 
            "tenant.id": tenant.id,
            archived: false
          }
        }
      }
    });

    const buildings = buildingsQuery.buildings;
    
    if (buildings.length === 0) {
      return NextResponse.json({ error: "No buildings found for tenant" }, { status: 404 });
    }

    // Generate compliance data
    await generateComplianceDataForAllBuildings(buildings, tenant.id);

    return NextResponse.json({ 
      success: true, 
      message: `Generated compliance data for ${buildings.length} buildings` 
    });
  } catch (error) {
    console.error("Error seeding compliance data:", error);
    return NextResponse.json({ error: "Failed to seed compliance data" }, { status: 500 });
  }
}