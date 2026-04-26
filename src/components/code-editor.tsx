"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[120px] w-full animate-pulse bg-[#161616]" />
    ),
  }
);

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;
const THEME_NAME = "devstash-dark";

function defineTheme(monaco: typeof Monaco) {
  monaco.editor.defineTheme(THEME_NAME, {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#161616",
      "editorGutter.background": "#161616",
      "editorLineNumber.foreground": "#4b4b4b",
      "editorLineNumber.activeForeground": "#a8a8a8",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#ffffff15",
      "scrollbarSlider.hoverBackground": "#ffffff28",
      "scrollbarSlider.activeBackground": "#ffffff3a",
    },
  });
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    defineTheme(monaco);
    monaco.editor.setTheme(THEME_NAME);
    editorRef.current = editor;

    const updateHeight = () => {
      const next = Math.min(
        MAX_HEIGHT,
        Math.max(MIN_HEIGHT, editor.getContentHeight())
      );
      setHeight(next);
    };

    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
  };

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore – user can retry
    }
  }

  const langLabel = (language ?? "").trim() || "plaintext";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-[#161616]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-[#1f1f1f] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {langLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            disabled={!value}
            aria-label={copied ? "Copied" : "Copy code"}
            className="size-6"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div style={{ height }}>
        <MonacoEditor
          value={value}
          onChange={(v) => onChange?.(v ?? "")}
          language={langLabel}
          onMount={handleMount}
          theme={THEME_NAME}
          options={{
            readOnly,
            domReadOnly: readOnly,
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
            renderLineHighlight: readOnly ? "none" : "line",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            roundedSelection: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            contextmenu: false,
          }}
        />
      </div>
    </div>
  );
}
