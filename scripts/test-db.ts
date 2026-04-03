import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully!\n");

    // Fetch demo user with counts
    const user = await prisma.user.findUnique({
      where: { email: "demo@devstash.io" },
      include: {
        items: { select: { id: true } },
        collections: { select: { id: true } },
      },
    });

    if (!user) {
      console.log("No demo user found. Run the seed script first: npx tsx prisma/seed.ts");
      return;
    }

    console.log("── User ──────────────────────────────────────");
    console.log(`  Name:  ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Pro:   ${user.isPro}`);
    console.log(`  Items: ${user.items.length}`);
    console.log(`  Collections: ${user.collections.length}`);

    // Item types
    const itemTypes = await prisma.itemType.findMany({
      include: { _count: { select: { items: true } } },
    });
    console.log("\n── Item Types ────────────────────────────────");
    for (const t of itemTypes) {
      console.log(`  ${t.icon.padEnd(12)} ${t.name.padEnd(10)} ${t.color}  (${t._count.items} items)`);
    }

    // Collections with item counts
    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "asc" },
    });
    console.log("\n── Collections ───────────────────────────────");
    for (const c of collections) {
      const fav = c.isFavorite ? " ★" : "";
      console.log(`  ${c.name.padEnd(22)} ${c._count.items} items${fav}`);
    }

    // Items with tags and collections
    const items = await prisma.item.findMany({
      where: { userId: user.id },
      include: {
        itemType: { select: { name: true } },
        tags: { include: { tag: { select: { name: true } } } },
        collections: { include: { collection: { select: { name: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });
    console.log("\n── Items ─────────────────────────────────────");
    for (const item of items) {
      const type = item.itemType.name.padEnd(8);
      const fav = item.isFavorite ? "★ " : "  ";
      const pin = item.isPinned ? "📌 " : "   ";
      const tagList = item.tags.map((t) => t.tag.name).join(", ");
      const colList = item.collections.map((c) => c.collection.name).join(", ");
      console.log(`  ${fav}${pin}[${type}] ${item.title}`);
      console.log(`         Tags: ${tagList}`);
      console.log(`         Collection: ${colList}`);
    }

    // Tags
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { name: "asc" },
    });
    console.log("\n── Tags ──────────────────────────────────────");
    const tagSummary = tags.map((t) => `${t.name}(${t._count.items})`).join(", ");
    console.log(`  ${tagSummary}`);

    console.log("\n── Summary ───────────────────────────────────");
    console.log(`  Users:       ${await prisma.user.count()}`);
    console.log(`  Item Types:  ${itemTypes.length}`);
    console.log(`  Collections: ${collections.length}`);
    console.log(`  Items:       ${items.length}`);
    console.log(`  Tags:        ${tags.length}`);
    console.log("\nDatabase test passed!");
  } catch (error) {
    console.error("Database test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
