import { Layers, FolderOpen, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/items";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total Items",
      value: stats.totalItems,
      icon: Layers,
      color: "text-blue-500",
    },
    {
      label: "Collections",
      value: stats.totalCollections,
      icon: FolderOpen,
      color: "text-emerald-500",
    },
    {
      label: "Favorite Items",
      value: stats.favoriteItems,
      icon: Heart,
      color: "text-pink-500",
    },
    {
      label: "Favorite Collections",
      value: stats.favoriteCollections,
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-md bg-muted p-2 ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
