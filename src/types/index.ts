export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestedCode?: string // AI's suggested code change
}

export interface Thread {
  id: string
  startLine: number
  endLine: number
  selectedText: string
  language: string
  messages: Message[]
  status: 'active' | 'resolved'
  createdAt: number
  codeSnapshot?: string // Full code at thread creation time
  isStale?: boolean // True when code has changed since thread creation
}

export interface Selection {
  startLine: number
  endLine: number
  startColumn: number
  endColumn: number
  text: string
}

export interface EditorState {
  code: string
  language: string
  fileName: string
  threads: Thread[]
  activeThreadId: string | null
  currentSelection: Selection | null
  archivedThreads: Thread[] // Threads from previous code versions
}
