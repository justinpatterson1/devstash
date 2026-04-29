import { describe, it, expect } from "vitest";
import {
  validateUpload,
  formatBytes,
  getExtension,
  MAX_SIZE,
} from "./file-constraints";

describe("getExtension", () => {
  it("returns lowercase extension", () => {
    expect(getExtension("foo.PNG")).toBe("png");
  });
  it("returns empty string when no dot", () => {
    expect(getExtension("README")).toBe("");
  });
});

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1500)).toBe("1.5 KB");
    expect(formatBytes(1024 * 1024 * 3)).toBe("3.0 MB");
  });
});

describe("validateUpload", () => {
  it("rejects empty files", () => {
    const result = validateUpload("image", {
      name: "x.png",
      size: 0,
      type: "image/png",
    });
    expect(result.valid).toBe(false);
  });

  it("rejects files exceeding the size limit", () => {
    const result = validateUpload("image", {
      name: "big.png",
      size: MAX_SIZE.image + 1,
      type: "image/png",
    });
    expect(result.valid).toBe(false);
  });

  it("accepts allowed image MIME", () => {
    const result = validateUpload("image", {
      name: "logo.svg",
      size: 1024,
      type: "image/svg+xml",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects disallowed image type", () => {
    const result = validateUpload("image", {
      name: "movie.mp4",
      size: 1024,
      type: "video/mp4",
    });
    expect(result.valid).toBe(false);
  });

  it("falls back to extension when MIME is empty", () => {
    const result = validateUpload("file", {
      name: "config.toml",
      size: 1024,
      type: "",
    });
    expect(result.valid).toBe(true);
  });

  it("rejects file with unsupported extension and unknown MIME", () => {
    const result = validateUpload("file", {
      name: "binary.exe",
      size: 1024,
      type: "application/octet-stream",
    });
    expect(result.valid).toBe(false);
  });
});
