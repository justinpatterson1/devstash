import { FolderOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { collections } from "@/lib/mock-data";

const recentCollections = [...collections]
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export function CollectionsSection() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Collections
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recentCollections.map((col) => (
          <Card key={col.id} className="cursor-pointer transition-colors hover:bg-muted/50">
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
              <p className="mt-2 text-xs text-muted-foreground">
                {col.itemCount} items
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
