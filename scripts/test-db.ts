import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    // Test connection
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully!\n");

    // Count records in each table
    const [users, items, itemTypes, collections, tags] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.tag.count(),
    ]);

    console.log("Table counts:");
    console.log(`  Users:       ${users}`);
    console.log(`  Items:       ${items}`);
    console.log(`  ItemTypes:   ${itemTypes}`);
    console.log(`  Collections: ${collections}`);
    console.log(`  Tags:        ${tags}`);
    console.log("\nDatabase test passed!");
  } catch (error) {
    console.error("Database test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
