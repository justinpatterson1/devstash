import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  Layers,
  Pin,
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

const pinnedItems = items.filter((i) => i.isPinned);

export function PinnedItems() {
  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Pinned
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pinnedItems.map((item) => {
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
                  <Pin className="size-3.5 shrink-0 rotate-45 text-muted-foreground" />
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
