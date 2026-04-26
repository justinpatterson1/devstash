"use client";

import {
  Star,
  Pin,
  Copy,
  Pencil,
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { ItemDrawerEdit } from "@/components/items/item-drawer-edit";
import { ItemDrawerDeleteDialog } from "@/components/items/item-drawer-delete-dialog";
import type { ItemFull } from "@/lib/db/items";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getCopyValue(item: ItemFull): string | null {
  if (item.content) return item.content;
  if (item.url) return item.url;
  if (item.fileUrl) return item.fileUrl;
  return null;
}

export function ItemDrawer({
  open,
  onOpenChange,
  item,
  loading,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemFull | null;
  loading: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaved: (updated: ItemFull) => void;
  onDeleted: () => void;
}) {
  async function handleCopy() {
    if (!item) return;
    const value = getCopyValue(item);
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        {loading || !item ? (
          <DrawerSkeleton />
        ) : isEditing ? (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>Edit {item.title}</SheetTitle>
            </SheetHeader>
            <ItemDrawerEdit
              item={item}
              onCancel={onCancelEdit}
              onSaved={onSaved}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 border-b border-border py-2 pl-3 pr-12">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={item.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <Star
                  className={
                    item.isFavorite
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={item.isPinned ? "Unpin" : "Pin"}
              >
                <Pin
                  className={
                    item.isPinned
                      ? "rotate-45 text-foreground"
                      : "rotate-45 text-muted-foreground"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                disabled={!getCopyValue(item)}
                aria-label="Copy"
              >
                <Copy />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onStartEdit}
                aria-label="Edit"
              >
                <Pencil />
              </Button>
              <div className="flex-1" />
              <ItemDrawerDeleteDialog
                itemId={item.id}
                itemTitle={item.title}
                onDeleted={onDeleted}
              />
            </div>

            <div className="overflow-y-auto">
              <SheetHeader className="gap-2 border-b border-border">
                <TypeBadge
                  typeName={item.typeName}
                  typeIcon={item.typeIcon}
                  typeColor={item.typeColor}
                />
                <SheetTitle>{item.title}</SheetTitle>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </SheetHeader>

              <div className="flex flex-col gap-4 p-4">
                {item.tags.length > 0 && (
                  <Section label="Tags">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}

                {item.collections.length > 0 && (
                  <Section label="Collections">
                    <div className="flex flex-wrap gap-1.5">
                      {item.collections.map((c) => (
                        <Badge
                          key={c.id}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </Section>
                )}

                <ContentBlock item={item} />

                <Section label="Metadata">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{formatDate(item.createdAt)}</dd>
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd>{formatDate(item.updatedAt)}</dd>
                    {item.language && (
                      <>
                        <dt className="text-muted-foreground">Language</dt>
                        <dd>{item.language}</dd>
                      </>
                    )}
                    {item.fileName && (
                      <>
                        <dt className="text-muted-foreground">File</dt>
                        <dd>{item.fileName}</dd>
                      </>
                    )}
                    {item.fileSize !== null && item.fileSize !== undefined && (
                      <>
                        <dt className="text-muted-foreground">Size</dt>
                        <dd>{formatFileSize(item.fileSize)}</dd>
                      </>
                    )}
                  </dl>
                </Section>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function TypeBadge({
  typeName,
  typeIcon,
  typeColor,
}: {
  typeName: string;
  typeIcon: string;
  typeColor: string;
}) {
  const Icon = iconMap[typeIcon] ?? Layers;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" style={{ color: typeColor }} />
      <span className="capitalize">{typeName}</span>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      {children}
    </div>
  );
}

function ContentBlock({ item }: { item: ItemFull }) {
  if (item.url) {
    return (
      <Section label="URL">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary underline break-all"
        >
          {item.url}
        </a>
      </Section>
    );
  }

  if (item.fileUrl) {
    return (
      <Section label="File">
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary underline break-all"
        >
          {item.fileName ?? item.fileUrl}
        </a>
      </Section>
    );
  }

  if (item.content) {
    const typeName = item.typeName.toLowerCase();
    const isCode = typeName === "snippet" || typeName === "command";
    return (
      <Section label="Content">
        {isCode ? (
          <CodeEditor
            value={item.content}
            language={item.language ?? undefined}
            readOnly
          />
        ) : (
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs font-mono">
            {item.content}
          </pre>
        )}
      </Section>
    );
  }

  return null;
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="size-7 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
      <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-3 w-full rounded bg-muted animate-pulse" />
      <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
      <div className="h-24 w-full rounded bg-muted animate-pulse" />
    </div>
  );
}
