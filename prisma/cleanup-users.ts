import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoEmail = "demo@devstash.io";

  // Find all non-demo users
  const users = await prisma.user.findMany({
    where: { email: { not: demoEmail } },
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.log("No users to remove (only demo account exists).");
    return;
  }

  console.log(`Found ${users.length} non-demo user(s) to remove:`);
  users.forEach((u) => console.log(`  - ${u.email}`));

  const userIds = users.map((u) => u.id);

  // Cascade deletes handle items, collections, accounts, sessions
  const deleted = await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  // Clean up any orphaned verification tokens
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: { notIn: [demoEmail] },
    },
  });

  console.log(`\nDeleted ${deleted.count} user(s) and their content.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
