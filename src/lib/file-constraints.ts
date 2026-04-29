export type UploadKind = "image" | "file";

const MB = 1024 * 1024;

export const MAX_SIZE: Record<UploadKind, number> = {
  image: 5 * MB,
  file: 10 * MB,
};

export const ALLOWED_MIME: Record<UploadKind, ReadonlySet<string>> = {
  image: new Set([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ]),
  file: new Set([
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/json",
    "application/x-yaml",
    "text/yaml",
    "application/xml",
    "text/xml",
    "text/csv",
    "application/toml",
  ]),
};

export const ALLOWED_EXTENSIONS: Record<UploadKind, ReadonlySet<string>> = {
  image: new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]),
  file: new Set([
    "pdf",
    "txt",
    "md",
    "json",
    "yaml",
    "yml",
    "xml",
    "csv",
    "toml",
    "ini",
  ]),
};

export const ACCEPT_ATTR: Record<UploadKind, string> = {
  image: ".png,.jpg,.jpeg,.gif,.webp,.svg,image/*",
  file: ".pdf,.txt,.md,.json,.yaml,.yml,.xml,.csv,.toml,.ini",
};

export function getExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "";
  return name.slice(dot + 1).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateUpload(
  kind: UploadKind,
  file: { name: string; size: number; type: string }
): ValidationResult {
  const ext = getExtension(file.name);
  const max = MAX_SIZE[kind];

  if (file.size <= 0) {
    return { valid: false, error: "File is empty" };
  }
  if (file.size > max) {
    return {
      valid: false,
      error: `File exceeds ${formatBytes(max)} limit`,
    };
  }

  const mimeOk = ALLOWED_MIME[kind].has(file.type);
  const extOk = ALLOWED_EXTENSIONS[kind].has(ext);

  // Some browsers send empty/wrong MIME for less-common formats (.toml, .ini, .md).
  // Accept if either MIME or extension matches the allow list.
  if (!mimeOk && !extOk) {
    return {
      valid: false,
      error: `Unsupported ${kind} type`,
    };
  }

  return { valid: true };
}
