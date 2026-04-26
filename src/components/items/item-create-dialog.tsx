"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/code-editor";
import { createItem, type CreateItemInput } from "@/actions/items";

type ItemType = "snippet" | "prompt" | "command" | "note" | "link";

const TYPES: { value: ItemType; label: string }[] = [
  { value: "snippet", label: "Snippet" },
  { value: "prompt", label: "Prompt" },
  { value: "command", label: "Command" },
  { value: "note", label: "Note" },
  { value: "link", label: "Link" },
];

const TYPES_WITH_CONTENT: ReadonlySet<ItemType> = new Set([
  "snippet",
  "prompt",
  "command",
  "note",
]);
const TYPES_WITH_LANGUAGE: ReadonlySet<ItemType> = new Set([
  "snippet",
  "command",
]);

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function ItemCreateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<ItemType>("snippet");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [url, setUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | null
  >(null);

  function reset() {
    setType("snippet");
    setTitle("");
    setDescription("");
    setTagsInput("");
    setContent("");
    setLanguage("");
    setUrl("");
    setFieldErrors(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next && isPending) return;
    setOpen(next);
    if (!next) reset();
  }

  function buildPayload(): CreateItemInput {
    const tags = parseTags(tagsInput);
    switch (type) {
      case "snippet":
        return { type, title, description, tags, content, language };
      case "command":
        return { type, title, description, tags, content, language };
      case "prompt":
        return { type, title, description, tags, content };
      case "note":
        return { type, title, description, tags, content };
      case "link":
        return { type, title, description, tags, url };
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors(null);
    const payload = buildPayload();
    startTransition(async () => {
      const result = await createItem(payload);
      if (result.success) {
        setOpen(false);
        reset();
        router.refresh();
        toast.success("Item created");
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        toast.error(result.error);
      }
    });
  }

  const showContent = TYPES_WITH_CONTENT.has(type);
  const showLanguage = TYPES_WITH_LANGUAGE.has(type);
  const showUrl = type === "link";
  const submitDisabled =
    isPending ||
    title.trim().length === 0 ||
    (type === "link" && url.trim().length === 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Item</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New item</DialogTitle>
            <DialogDescription>
              Add a snippet, prompt, command, note, or link to your stash.
            </DialogDescription>
          </DialogHeader>

          <FieldRow label="Type">
            <Select
              value={type}
              onValueChange={(v) => setType(v as ItemType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>

          <FieldRow label="Title" error={fieldErrors?.title?.[0]}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              aria-invalid={Boolean(fieldErrors?.title)}
            />
          </FieldRow>

          <FieldRow
            label="Description"
            error={fieldErrors?.description?.[0]}
          >
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </FieldRow>

          <FieldRow
            label="Tags"
            hint="Comma-separated"
            error={fieldErrors?.tags?.[0]}
          >
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, hooks"
            />
          </FieldRow>

          {showContent && (
            <FieldRow label="Content" error={fieldErrors?.content?.[0]}>
              {showLanguage ? (
                <CodeEditor
                  value={content}
                  onChange={setContent}
                  language={language}
                />
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="max-h-64 overflow-y-auto font-mono text-xs"
                />
              )}
            </FieldRow>
          )}

          {showUrl && (
            <FieldRow label="URL" error={fieldErrors?.url?.[0]}>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                aria-invalid={Boolean(fieldErrors?.url)}
              />
            </FieldRow>
          )}

          {showLanguage && (
            <FieldRow label="Language" error={fieldErrors?.language?.[0]}>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="typescript"
              />
            </FieldRow>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitDisabled}>
              {isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        {hint && !error && (
          <span className="text-[10px] text-muted-foreground">{hint}</span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
