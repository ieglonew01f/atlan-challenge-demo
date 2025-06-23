"use client";

import { useCallback, useEffect, useRef } from "react";

import Editor from "@monaco-editor/react";
import { SQL_KEYWORDS } from "@/constants/sql-keywords";

export function QueryEditor({
  value,
  onChange,
  onRunShortcut,
  isMaximized,
}: {
  value: string;
  onChange: (val: string) => void;
  onRunShortcut: (val: string) => void;
  isMaximized: boolean;
}) {
  const editorRef = useRef<any>(null);

  /**
   * This function sets up SQL keyword autocompletion in the Monaco editor.
   *
   * @param editor - The `editor` instance provided by Monaco. It's unused in this context,
   *           so we use `_` to indicate an intentionally ignored parameter (convention).
   * @param monaco - The Monaco namespace. Ideally this would be strongly typed, but
   *                 @monaco-editor/react doesn't export its types by default, so we fallback to `any`
   */
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, // Cmd + Enter (Mac) or Ctrl + Enter (Win/Linux)
      () => {
        const currentValue = editor.getValue();
        onRunShortcut(currentValue);
      }
    );

    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: () => {
        const suggestions = SQL_KEYWORDS.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword + " ",
        }));
        return { suggestions };
      }
    });
  }, []);

  // Force layout after maximize/minimize toggle
  useEffect(() => {
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 0);
  }, [isMaximized]);

  return (
    <div className="w-full h-60 border border-border rounded">
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollbar: { vertical: "auto" },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
      <div className="text-xs text-muted-foreground mt-1 text-right pr-2 mt-3">
        Press <kbd className="px-1 border rounded">⌘</kbd>/<kbd className="px-1 border rounded">Ctrl</kbd> + <kbd className="px-1 border rounded">Enter</kbd> to run
      </div>
    </div>
  );
}
