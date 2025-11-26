import { useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '../store'
import { autoDetectLanguage } from '../utils/languageDetection'
import type { editor } from 'monaco-editor'

export default function EditorPanel() {
  const { code, setCode, language, setLanguage, setCurrentSelection, threads, activeThreadId } =
    useEditorStore()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const previousCodeRef = useRef<string>('')

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor

    // Set up selection listener
    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection
      const model = editor.getModel()

      if (!model) return

      // Only update if there's an actual selection (not just cursor position)
      if (
        selection.startLineNumber !== selection.endLineNumber ||
        selection.startColumn !== selection.endColumn
      ) {
        const selectedText = model.getValueInRange(selection)
        setCurrentSelection({
          startLine: selection.startLineNumber,
          endLine: selection.endLineNumber,
          startColumn: selection.startColumn,
          endColumn: selection.endColumn,
          text: selectedText,
        })
      } else {
        // Clear selection if just cursor
        setCurrentSelection(null)
      }
    })
  }

  // Auto-detect language when code is pasted (significant content change)
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    const previousCode = previousCodeRef.current

    // Check if this is a paste operation (significant new content)
    const isPaste = 
      previousCode.length < 50 && 
      newCode.length > 100 && 
      (newCode.length - previousCode.length) > 50

    if (isPaste) {
      // Auto-detect language from content
      const { fileName } = useEditorStore.getState()
      const detectedLanguage = autoDetectLanguage(fileName, newCode)
      setLanguage(detectedLanguage)
    }

    previousCodeRef.current = newCode
    setCode(newCode)
  }

  // Update decorations when threads change
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const decorations = threads.map((thread) => ({
      range: {
        startLineNumber: thread.startLine,
        startColumn: 1,
        endLineNumber: thread.endLine,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className:
          thread.id === activeThreadId
            ? 'thread-line-active'
            : thread.isStale
              ? 'thread-line-stale'
              : thread.status === 'resolved'
                ? 'thread-line-resolved'
                : 'thread-line-inactive',
        glyphMarginClassName:
          thread.id === activeThreadId
            ? 'thread-glyph-active'
            : thread.isStale
              ? 'thread-glyph-stale'
              : thread.status === 'resolved'
                ? 'thread-glyph-resolved'
                : 'thread-glyph-inactive',
      },
    }))

    editor.createDecorationsCollection(decorations)
  }, [threads, activeThreadId])

  // Scroll to active thread when it changes
  useEffect(() => {
    const editor = editorRef.current
    if (!editor || !activeThreadId) return

    const activeThread = threads.find((t) => t.id === activeThreadId)
    if (!activeThread) return

    // Scroll to the thread's line range
    editor.revealLineInCenter(activeThread.startLine)
  }, [activeThreadId, threads])

  return (
    <div className="w-[70%] h-full bg-gray-900 border-r border-gray-700">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          glyphMargin: true,
        }}
        onMount={handleEditorMount}
      />
    </div>
  )
}
