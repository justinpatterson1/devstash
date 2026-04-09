import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getItemTypesWithCounts, getSidebarCollections } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/api/auth/signin");
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
