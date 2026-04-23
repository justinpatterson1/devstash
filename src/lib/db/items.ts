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

export type SidebarItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export type SidebarCollection = {
  id: string;
  name: string;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string;
};

export async function getItemTypesWithCounts(
  userId: string
): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      items: { where: { userId }, select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  return types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    count: t.items.length,
  }));
}

export async function getSidebarCollections(
  userId: string
): Promise<{ favorites: SidebarCollection[]; recents: SidebarCollection[] }> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: { select: { color: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  function toDominantColor(
    items: { item: { itemType: { color: string } } }[]
  ): string {
    const counts = new Map<string, number>();
    for (const ic of items) {
      const color = ic.item.itemType.color;
      counts.set(color, (counts.get(color) ?? 0) + 1);
    }
    let dominant = "#6b7280";
    let max = 0;
    for (const [color, count] of counts) {
      if (count > max) {
        max = count;
        dominant = color;
      }
    }
    return dominant;
  }

  const mapped = collections.map((col) => ({
    id: col.id,
    name: col.name,
    isFavorite: col.isFavorite,
    itemCount: col.items.length,
    dominantColor: toDominantColor(col.items),
  }));

  return {
    favorites: mapped.filter((c) => c.isFavorite),
    recents: mapped.slice(0, 5),
  };
}

export async function getItemsByType(
  userId: string,
  typeName: string
): Promise<ItemWithDetails[]> {
  const items = await prisma.item.findMany({
    where: {
      userId,
      itemType: { name: typeName },
    },
    include: itemInclude,
    orderBy: { updatedAt: "desc" },
  });
  return items.map(mapItem);
}

export async function getItemTypeByName(
  name: string
): Promise<{ id: string; name: string; icon: string; color: string } | null> {
  return prisma.itemType.findUnique({
    where: { name },
    select: { id: true, name: true, icon: true, color: true },
  });
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
