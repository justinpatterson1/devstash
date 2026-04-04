import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getItemTypesWithCounts, getSidebarCollections } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await prisma.user.findFirst();

  if (!user) {
    return <div className="flex h-full items-center justify-center">{children}</div>;
  }

  const [itemTypes, { favorites, recents }] = await Promise.all([
    getItemTypesWithCounts(user.id),
    getSidebarCollections(user.id),
  ]);

  return (
    <DashboardShell
      sidebarData={{
        itemTypes,
        favoriteCollections: favorites,
        recentCollections: recents,
        userName: user.name ?? "User",
        isPro: user.isPro,
      }}
    >
      {children}
    </DashboardShell>
  );
}
