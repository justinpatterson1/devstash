import { prisma } from "@/lib/prisma";

export type CollectionWithStats = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string;
  typeIcons: { icon: string; color: string }[];
  updatedAt: Date;
};

export async function getRecentCollections(
  userId: string
): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: { select: { name: true, icon: true, color: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return collections.map((col) => {
    // Count items per type to find the dominant type
    const typeCounts = new Map<string, { count: number; icon: string; color: string }>();

    for (const ic of col.items) {
      const type = ic.item.itemType;
      const existing = typeCounts.get(type.name);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(type.name, { count: 1, icon: type.icon, color: type.color });
      }
    }

    // Dominant color from most-used type, fallback to muted
    let dominantColor = "#6b7280";
    let maxCount = 0;
    for (const entry of typeCounts.values()) {
      if (entry.count > maxCount) {
        maxCount = entry.count;
        dominantColor = entry.color;
      }
    }

    // Unique type icons in this collection
    const typeIcons = Array.from(typeCounts.values()).map(({ icon, color }) => ({
      icon,
      color,
    }));

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantColor,
      typeIcons,
      updatedAt: col.updatedAt,
    };
  });
}
