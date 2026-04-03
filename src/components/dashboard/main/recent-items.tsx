import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  Layers,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { items, itemTypes } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

const recentItems = [...items]
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .slice(0, 10);

export function RecentItems() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          All Items
        </h2>
        <span className="text-xs text-muted-foreground">{items.length} items</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recentItems.map((item) => {
          const type = itemTypes.find((t) => t.id === item.itemTypeId);
          const Icon = type ? (iconMap[type.icon] ?? Layers) : Layers;
          return (
            <Card key={item.id} className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="size-4 shrink-0"
                      style={{ color: type?.color }}
                    />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  {item.isFavorite && (
                    <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
                {item.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
