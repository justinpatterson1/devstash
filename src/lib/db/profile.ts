import { prisma } from "@/lib/prisma"

export type ProfileData = {
  id: string
  name: string | null
  email: string
  image: string | null
  isPro: boolean
  hasPassword: boolean
  createdAt: Date
  stats: {
    totalItems: number
    totalCollections: number
    itemsByType: { name: string; icon: string; color: string; count: number }[]
  }
}

export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isPro: true,
      password: true,
      createdAt: true,
      _count: { select: { items: true, collections: true } },
    },
  })

  if (!user) return null

  const itemsByType = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: {
      name: true,
      icon: true,
      color: true,
      _count: { select: { items: { where: { userId } } } },
    },
    orderBy: { name: "asc" },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    isPro: user.isPro,
    hasPassword: !!user.password,
    createdAt: user.createdAt,
    stats: {
      totalItems: user._count.items,
      totalCollections: user._count.collections,
      itemsByType: itemsByType.map((t) => ({
        name: t.name,
        icon: t.icon,
        color: t.color,
        count: t._count.items,
      })),
    },
  }
}
