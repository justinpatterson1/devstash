import { StatsCards } from "@/components/dashboard/main/stats-cards";
import { CollectionsSection } from "@/components/dashboard/main/collections-section";
import { PinnedItems } from "@/components/dashboard/main/pinned-items";
import { RecentItems } from "@/components/dashboard/main/recent-items";
import { getRecentCollections } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Temporary: fetch first user until auth is implemented
  const user = await prisma.user.findFirst();
  const collections = user ? await getRecentCollections(user.id) : [];

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
      <StatsCards />
      <CollectionsSection collections={collections} />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
