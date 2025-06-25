"use client";

import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Minimize2Icon } from "lucide-react";
import { SQL_KEYWORDS } from "@/constants/sql-keywords";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="p-4 text-xs text-muted-foreground">Loading editor...</div>,
});

export function QueryEditor({
  value,
  onChange,
  onRunShortcut,
  onClose,
  isMaximized,
}: {
  value: string;
  onChange: (val: string) => void;
  onRunShortcut: (val: string) => void;
  onClose: () => void;
  isMaximized: boolean;
}) {
  const editorRef = useRef<any>(null);

  const handleMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onRunShortcut(editor.getValue())
    );
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: () => ({
        suggestions: SQL_KEYWORDS.map((kw) => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw + " ",
        })),
      }),
    });
  }, [onRunShortcut]);

  // force relayout when toggling in/out of fullscreen
  useEffect(() => {
    if (!editorRef.current) return;
    setTimeout(() => editorRef.current.layout(), 0);
  }, [isMaximized]);

  // your normal editor container
  const EditorBox = (
    <div className="w-full h-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollbar: { vertical: "auto" },
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );

  // if not maximized, render inline
  if (!isMaximized) {
    return (
      <div className="h-60 border border-border rounded overflow-hidden">
        {EditorBox}
      </div>
    );
  }

  // if maximized, render as a fixed overlay
  return (
    <div
      className="
        fixed inset-0 
        z-50 
        bg-black/90 
        p-4 
        flex 
        flex-col
      "
    >
      <div className="flex-grow border border-border rounded overflow-hidden">
        {EditorBox}
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        <Minimize2Icon/>
      </Button>
    </div>
  );
}
