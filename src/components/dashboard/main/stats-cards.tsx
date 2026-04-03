import { Layers, FolderOpen, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { items, collections } from "@/lib/mock-data";

const stats = [
  {
    label: "Total Items",
    value: items.length,
    icon: Layers,
    color: "text-blue-500",
  },
  {
    label: "Collections",
    value: collections.length,
    icon: FolderOpen,
    color: "text-emerald-500",
  },
  {
    label: "Favorite Items",
    value: items.filter((i) => i.isFavorite).length,
    icon: Heart,
    color: "text-pink-500",
  },
  {
    label: "Favorite Collections",
    value: collections.filter((c) => c.isFavorite).length,
    icon: Star,
    color: "text-yellow-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
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
