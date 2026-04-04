import { prisma } from "@/lib/prisma";

export type ItemWithDetails = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  typeIcon: string;
  typeColor: string;
  typeName: string;
  updatedAt: Date;
};

export type DashboardStats = {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
};

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: { name: string; icon: string; color: string };
  tags: { tag: { name: string } }[];
}): ItemWithDetails {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    typeIcon: item.itemType.icon,
    typeColor: item.itemType.color,
    typeName: item.itemType.name,
    updatedAt: item.updatedAt,
  };
}

const itemInclude = {
  itemType: { select: { name: true, icon: true, color: true } },
  tags: { include: { tag: { select: { name: true } } } },
} as const;

export async function getPinnedItems(userId: string): Promise<ItemWithDetails[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    include: itemInclude,
    orderBy: { updatedAt: "desc" },
  });
  return items.map(mapItem);
}

export async function getRecentItems(
  userId: string,
  limit = 10
): Promise<ItemWithDetails[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    include: itemInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return items.map(mapItem);
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
