import { StatsCards } from "@/components/dashboard/main/stats-cards";
import { CollectionsSection } from "@/components/dashboard/main/collections-section";
import { PinnedItems } from "@/components/dashboard/main/pinned-items";
import { RecentItems } from "@/components/dashboard/main/recent-items";
import { getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getDashboardStats } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Temporary: fetch first user until auth is implemented
  const user = await prisma.user.findFirst();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No user found. Run the seed script first.</p>
      </div>
    );
  }

  const [collections, pinnedItems, recentItems, stats] = await Promise.all([
    getRecentCollections(user.id),
    getPinnedItems(user.id),
    getRecentItems(user.id, 10),
    getDashboardStats(user.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
      <StatsCards stats={stats} />
      <CollectionsSection collections={collections} />
      <PinnedItems items={pinnedItems} />
      <RecentItems items={recentItems} totalCount={stats.totalItems} />
    </div>
  );
}
