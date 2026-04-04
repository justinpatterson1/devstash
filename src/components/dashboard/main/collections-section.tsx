import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  FolderOpen,
  Star,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CollectionWithStats } from "@/lib/db/collections";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

export function CollectionsSection({
  collections,
}: {
  collections: CollectionWithStats[];
}) {
  if (collections.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Collections
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((col) => (
          <Card
            key={col.id}
            className="cursor-pointer transition-colors hover:bg-muted/50"
            style={{ borderLeftWidth: "3px", borderLeftColor: col.dominantColor }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{col.name}</span>
                </div>
                {col.isFavorite && (
                  <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                )}
              </div>
              {col.description && (
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
                  {col.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {col.typeIcons.map((t) => {
                    const Icon = iconMap[t.icon] ?? Layers;
                    return (
                      <Icon
                        key={t.icon}
                        className="size-3.5"
                        style={{ color: t.color }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
