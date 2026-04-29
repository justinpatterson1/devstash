"use client";

import { useRef, useState } from "react";
import { Upload, X, FileIcon, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ACCEPT_ATTR,
  MAX_SIZE,
  formatBytes,
  validateUpload,
  type UploadKind,
} from "@/lib/file-constraints";

export type UploadedFile = {
  url: string;
  name: string;
  size: number;
  contentType: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number; name: string }
  | { kind: "error"; message: string };

export function FileUpload({
  kind,
  value,
  onChange,
  onError,
}: {
  kind: UploadKind;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  onError?: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragOver, setDragOver] = useState(false);

  function reportError(message: string) {
    setStatus({ kind: "error", message });
    onError?.(message);
  }

  function startUpload(file: File) {
    const validation = validateUpload(kind, {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    if (!validation.valid) {
      reportError(validation.error);
      return;
    }

    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    setStatus({ kind: "uploading", progress: 0, name: file.name });

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const progress = Math.round((e.loaded / e.total) * 100);
      setStatus({ kind: "uploading", progress, name: file.name });
    };

    xhr.onload = () => {
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as UploadedFile;
          setStatus({ kind: "idle" });
          onChange(body);
        } catch {
          reportError("Invalid server response");
        }
        return;
      }
      let message = "Upload failed";
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // keep generic message
      }
      reportError(message);
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      reportError("Network error");
    };

    xhr.onabort = () => {
      xhrRef.current = null;
      setStatus({ kind: "idle" });
    };

    xhr.open("POST", "/api/upload");
    xhr.send(form);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    startUpload(files[0]);
  }

  function handleClick() {
    if (status.kind === "uploading") return;
    inputRef.current?.click();
  }

  function handleClear() {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setStatus({ kind: "idle" });
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isUploading = status.kind === "uploading";
  const Icon = kind === "image" ? ImageIcon : FileIcon;

  if (value && !isUploading) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
        {kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt={value.name}
            className="size-12 rounded object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{value.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(value.size)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleClear}
          aria-label="Remove file"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR[kind]}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (isUploading) return;
          handleFiles(e.dataTransfer.files);
        }}
        disabled={isUploading}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/20 px-4 py-6 text-sm transition-colors",
          dragOver && "border-primary bg-muted/40",
          isUploading && "cursor-wait opacity-80"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {status.name} · {status.progress}%
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-[width]"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Drop {kind} here or click to browse
            </span>
            <span className="text-[10px] text-muted-foreground">
              Up to {formatBytes(MAX_SIZE[kind])}
            </span>
          </>
        )}
      </button>
      {status.kind === "error" && (
        <p className="mt-1.5 text-xs text-destructive">{status.message}</p>
      )}
    </div>
  );
}
