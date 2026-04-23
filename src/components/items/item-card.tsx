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
  Pin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ItemWithDetails } from "@/lib/db/items";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

export function ItemCard({ item }: { item: ItemWithDetails }) {
  const Icon = iconMap[item.typeIcon] ?? Layers;

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/50"
      style={{ borderLeftWidth: "3px", borderLeftColor: item.typeColor }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="size-4 shrink-0"
              style={{ color: item.typeColor }}
            />
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {item.isPinned && (
              <Pin className="size-3.5 shrink-0 rotate-45 text-muted-foreground" />
            )}
            {item.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
            )}
          </div>
        </div>
        {item.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
