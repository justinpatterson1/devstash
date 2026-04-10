import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StatsCards } from "@/components/dashboard/main/stats-cards";
import { CollectionsSection } from "@/components/dashboard/main/collections-section";
import { PinnedItems } from "@/components/dashboard/main/pinned-items";
import { RecentItems } from "@/components/dashboard/main/recent-items";
import { getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getDashboardStats } from "@/lib/db/items";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const [collections, pinnedItems, recentItems, stats] = await Promise.all([
    getRecentCollections(userId),
    getPinnedItems(userId),
    getRecentItems(userId, 10),
    getDashboardStats(userId),
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
