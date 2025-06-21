import { init, id } from "@instantdb/admin";
import schema from "../instant.schema";
import type { AppSchema } from "../instant.schema";

// Initialize InstantDB admin client
const db = init<AppSchema>({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

async function seed() {
  try {
    console.log("🌱 Starting seed...");

    // Create admin user
    const adminUserId = id();
    const adminProfileId = id();
    console.log("Creating admin user...");

    const dateString = new Date().toISOString();

    await db.transact([
      db.tx.$users[adminUserId].update({
        email: "crazycj96@gmail.com",
      }),
      db.tx.userProfiles[adminProfileId]
        .update({
          role: "admin",
          createdAt: dateString,
          updatedAt: dateString,
        })
        .link({
          $user: adminUserId,
        }),
    ]);

    // Create tenants
    const tenants = [
      {
        id: id(),
        name: "ASAP",
        slug: "asap",
        description: "ASAP",
      },
      {
        id: id(),
        name: "Play",
        slug: "play",
        description: "Playground",
      },
      {
        id: id(),
        name: "Akelius",
        slug: "akelius",
        description: "Akelius",
      },
    ];

    console.log("Creating tenants...");

    const tenantTransactions = tenants.map((tenant) =>
      db.tx.tenants[tenant.id].update({
        name: tenant.name,
        slug: tenant.slug,
        description: tenant.description,
        createdAt: dateString,
        updatedAt: dateString,
      })
    );

    await db.transact(tenantTransactions);

    console.log("✅ Seed completed successfully!");
    console.log(`Created admin user: admin@procomply.com`);
    console.log(
      `Created ${tenants.length} tenants:`,
      tenants.map((t) => t.name).join(", ")
    );
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run the seed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
