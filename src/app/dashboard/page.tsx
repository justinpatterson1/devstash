import { StatsCards } from "@/components/dashboard/main/stats-cards";
import { CollectionsSection } from "@/components/dashboard/main/collections-section";
import { PinnedItems } from "@/components/dashboard/main/pinned-items";
import { RecentItems } from "@/components/dashboard/main/recent-items";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-8">
      <StatsCards />
      <CollectionsSection />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
