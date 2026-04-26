"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateItem } from "@/actions/items";
import type { ItemFull } from "@/lib/db/items";

const contentTypes = new Set(["snippet", "prompt", "command", "note"]);
const languageTypes = new Set(["snippet", "command"]);
const urlTypes = new Set(["link"]);

function tagsToString(tags: string[]) {
  return tags.join(", ");
}

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function ItemDrawerEdit({
  item,
  onCancel,
  onSaved,
}: {
  item: ItemFull;
  onCancel: () => void;
  onSaved: (updated: ItemFull) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [content, setContent] = useState(item.content ?? "");
  const [url, setUrl] = useState(item.url ?? "");
  const [language, setLanguage] = useState(item.language ?? "");
  const [tagsInput, setTagsInput] = useState(tagsToString(item.tags));
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | null
  >(null);

  const typeName = item.typeName.toLowerCase();
  const showContent = contentTypes.has(typeName);
  const showLanguage = languageTypes.has(typeName);
  const showUrl = urlTypes.has(typeName);

  function handleSave() {
    setFieldErrors(null);
    startTransition(async () => {
      const result = await updateItem(item.id, {
        title,
        description,
        content,
        url,
        language,
        tags: parseTags(tagsInput),
      });

      if (result.success) {
        onSaved(result.data);
        router.refresh();
        toast.success("Item updated");
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        toast.error(result.error);
      }
    });
  }

  const saveDisabled = isPending || title.trim().length === 0;

  return (
    <>
      <div className="flex items-center justify-end gap-2 border-b border-border px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saveDisabled}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <FieldRow label="Title" error={fieldErrors?.title?.[0]}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={Boolean(fieldErrors?.title)}
          />
        </FieldRow>

        <FieldRow label="Description" error={fieldErrors?.description?.[0]}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
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
      </div>
    </>
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
