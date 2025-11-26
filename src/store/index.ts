import { create } from 'zustand'
import { EditorState, Selection, Thread, Message } from '../types'
import { sendToOpenAI } from '../utils/api'
import { buildUserPrompt, buildConversationHistory, SYSTEM_MESSAGE, extractSuggestedCode, stripLineNumbers } from '../utils/prompt'
import { autoDetectLanguage, detectLanguageFromContent, getExtensionForLanguage } from '../utils/languageDetection'

interface EditorActions {
  setCode: (code: string) => void
  setLanguage: (language: string) => void
  setFileName: (fileName: string) => void
  setCurrentSelection: (selection: Selection | null) => void
  setActiveThreadId: (threadId: string | null) => void
  createThread: (selection: Selection, language: string) => string
  addMessage: (threadId: string, message: Message) => void
  sendMessage: (threadId: string, content: string) => Promise<void>
  getActiveThread: () => Thread | null
  resolveThread: (threadId: string) => void
  switchThread: (threadId: string) => void
  applyCodeChange: (threadId: string, messageId: string) => void
  autoDetectLanguage: () => void
  getAllThreads: () => Thread[] // Active + archived
  exportFeedback: () => { threads: Thread[]; fileName: string; code: string }
}

type EditorStore = EditorState & EditorActions

const initialState: EditorState = {
  code: '',
  language: 'typescript',
  fileName: 'untitled.ts',
  threads: [],
  activeThreadId: null,
  currentSelection: null,
  archivedThreads: [],
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  setCode: (code: string) => {
    const state = get()
    
    // Mark threads as stale if code has changed significantly
    const updatedThreads = state.threads.map((thread) => {
      // Check if the selected text still exists at the same location
      const codeLines = code.split('\n')
      const threadLines = codeLines.slice(thread.startLine - 1, thread.endLine).join('\n')
      
      // If the code in this region has changed, mark as stale
      if (threadLines !== thread.selectedText) {
        return { ...thread, isStale: true }
      }
      return thread
    })
    
    set({ code, threads: updatedThreads })
  },

  setLanguage: (language: string) => set({ language }),

  setFileName: (fileName: string) => {
    const state = get()
    const detectedLanguage = autoDetectLanguage(fileName, state.code)
    set({ fileName, language: detectedLanguage })
  },

  setCurrentSelection: (selection: Selection | null) => set({ currentSelection: selection }),

  setActiveThreadId: (threadId: string | null) => set({ activeThreadId: threadId }),

  createThread: (selection: Selection, language: string): string => {
    const state = get()
    const newThread: Thread = {
      id: crypto.randomUUID(),
      startLine: selection.startLine,
      endLine: selection.endLine,
      selectedText: selection.text,
      language,
      messages: [],
      status: 'active',
      createdAt: Date.now(),
      codeSnapshot: state.code, // Store full code at creation time
      isStale: false,
    }

    set((state) => ({
      threads: [...state.threads, newThread],
      activeThreadId: newThread.id,
      currentSelection: null,
    }))

    return newThread.id
  },

  addMessage: (threadId: string, message: Message) => {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, messages: [...thread.messages, message] }
          : thread
      ),
    }))
  },

  sendMessage: async (threadId: string, content: string) => {
    const state = get()
    const thread = state.threads.find((t) => t.id === threadId)
    if (!thread) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    get().addMessage(threadId, userMessage)

    // Add loading message
    const loadingMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Thinking...',
      timestamp: Date.now(),
    }
    get().addMessage(threadId, loadingMessage)

    try {
      // Build conversation history
      const conversationHistory = buildConversationHistory([...thread.messages, userMessage])

      // Build the first user message with full context
      if (conversationHistory.length === 1) {
        conversationHistory[0].content = buildUserPrompt(
          thread,
          content,
          state.code,
          state.fileName
        )
      }

      // Call API with system message
      const messagesWithSystem = [
        { role: 'system' as const, content: SYSTEM_MESSAGE },
        ...conversationHistory,
      ]
      const response = await sendToOpenAI(messagesWithSystem)

      // Extract suggested code if present
      const suggestedCode = extractSuggestedCode(response)

      // Replace loading message with actual response
      set((state) => ({
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === loadingMessage.id
                    ? { 
                        ...m, 
                        content: response, 
                        timestamp: Date.now(),
                        suggestedCode: suggestedCode || undefined,
                      }
                    : m
                ),
              }
            : t
        ),
      }))
    } catch (error) {
      // Replace loading message with error
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'

      set((state) => ({
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === loadingMessage.id
                    ? {
                        ...m,
                        content: `Error: ${errorMessage}\n\nPlease try again.`,
                        timestamp: Date.now(),
                      }
                    : m
                ),
              }
            : t
        ),
      }))
    }
  },

  getActiveThread: (): Thread | null => {
    const state = get()
    return state.threads.find((t) => t.id === state.activeThreadId) || 
           state.archivedThreads.find((t) => t.id === state.activeThreadId) || 
           null
  },

  resolveThread: (threadId: string) => {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? { ...thread, status: 'resolved' } : thread
      ),
    }))
  },

  switchThread: (threadId: string) => {
    set({ activeThreadId: threadId })
  },

  applyCodeChange: (threadId: string, messageId: string) => {
    const state = get()
    const thread = state.threads.find((t) => t.id === threadId) ||
                   state.archivedThreads.find((t) => t.id === threadId)
    if (!thread) return

    const message = thread.messages.find((m) => m.id === messageId)
    if (!message?.suggestedCode) return

    // Get the suggested code (strip line numbers if present)
    const cleanSuggestedCode = stripLineNumbers(message.suggestedCode)

    // Split the suggested code into lines for proper insertion
    const suggestedLines = cleanSuggestedCode.split('\n')

    // Replace the selected code section with the suggested code
    const codeLines = state.code.split('\n')
    const beforeLines = codeLines.slice(0, thread.startLine - 1)
    const afterLines = codeLines.slice(thread.endLine)
    
    // Spread the suggested lines so each line is a separate array element
    const newCode = [...beforeLines, ...suggestedLines, ...afterLines].join('\n')
    
    // Calculate new end line
    const newEndLine = thread.startLine + suggestedLines.length - 1

    // Update code and thread in one go
    set((state) => ({
      code: newCode,
      threads: state.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              selectedText: cleanSuggestedCode,
              endLine: newEndLine,
              isStale: false,
            }
          : t
      ),
    }))
  },

  autoDetectLanguage: () => {
    const state = get()
    // When user clicks Auto, prioritize content-based detection
    // Only fall back to filename if content detection fails
    const contentLanguage = detectLanguageFromContent(state.code)
    const detectedLanguage = contentLanguage || autoDetectLanguage(state.fileName, state.code)
    
    // Update filename extension to match detected language
    const newExtension = getExtensionForLanguage(detectedLanguage)
    const currentFileName = state.fileName
    const baseName = currentFileName.replace(/\.[^.]+$/, '') || 'untitled'
    const newFileName = baseName + newExtension
    
    set({ language: detectedLanguage, fileName: newFileName })
  },

  getAllThreads: () => {
    const state = get()
    return [...state.threads, ...state.archivedThreads]
  },

  exportFeedback: () => {
    const state = get()
    return {
      threads: [...state.threads, ...state.archivedThreads],
      fileName: state.fileName,
      code: state.code,
    }
  },
}))
