"use client";

import {
  Download,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";
import { useItemDrawer } from "@/components/items/item-drawer-provider";
import { buttonVariants } from "@/components/ui/button";
import type { ItemWithDetails } from "@/lib/db/items";

const EXT_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  odt: FileText,
  rtf: FileText,
  txt: FileText,
  md: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  ods: FileSpreadsheet,
  zip: FileArchive,
  rar: FileArchive,
  "7z": FileArchive,
  tar: FileArchive,
  gz: FileArchive,
  mp4: FileVideo,
  mov: FileVideo,
  mkv: FileVideo,
  avi: FileVideo,
  webm: FileVideo,
  mp3: FileAudio,
  wav: FileAudio,
  flac: FileAudio,
  ogg: FileAudio,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  svg: FileImage,
  webp: FileImage,
  js: FileCode,
  jsx: FileCode,
  ts: FileCode,
  tsx: FileCode,
  py: FileCode,
  go: FileCode,
  rs: FileCode,
  java: FileCode,
  c: FileCode,
  cpp: FileCode,
  h: FileCode,
  html: FileCode,
  css: FileCode,
  json: FileCode,
  yaml: FileCode,
  yml: FileCode,
  sh: FileCode,
};

function getExtension(name: string | null): string {
  if (!name) return "";
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function FileRow({ item }: { item: ItemWithDetails }) {
  const { openItem } = useItemDrawer();
  const Icon = EXT_ICONS[getExtension(item.fileName)] ?? File;

  function handleClick() {
    openItem(item.id);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openItem(item.id);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4"
    >
      <Icon
        className="size-5 shrink-0"
        style={{ color: item.typeColor }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{item.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
          {item.fileSize !== null && <span>{formatBytes(item.fileSize)}</span>}
          {item.fileSize !== null && <span aria-hidden>·</span>}
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </div>
      <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
        {item.fileSize !== null ? formatBytes(item.fileSize) : "—"}
      </span>
      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
        {formatDate(item.createdAt)}
      </span>
      <a
        href={`/api/files/${item.id}`}
        download={item.fileName ?? undefined}
        onClick={(e) => e.stopPropagation()}
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        aria-label={`Download ${item.title}`}
      >
        <Download className="size-4" />
      </a>
    </div>
  );
}
