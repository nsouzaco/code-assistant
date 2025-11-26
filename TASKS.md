# AI Code Review Assistant — Task List

## Phase 1: Foundation

### 1.1 Project Setup
- [x] Initialize Vite project with React 18 and TypeScript
- [x] Install and configure Tailwind CSS
- [x] Install Zustand for state management
- [x] Install Monaco Editor React wrapper (`@monaco-editor/react`)
- [x] Set up project folder structure (`/components`, `/store`, `/types`, `/hooks`, `/utils`)
- [x] Configure ESLint and Prettier

### 1.2 Type Definitions
- [x] Define `Thread` interface
- [x] Define `Message` interface
- [x] Define `EditorState` interface
- [x] Define `Selection` interface
- [x] Export all types from `/types/index.ts`

### 1.3 State Management
- [x] Create Zustand store with initial state
- [x] Implement `setCode` action
- [x] Implement `setLanguage` action
- [x] Implement `setFileName` action
- [x] Implement `setCurrentSelection` action
- [x] Implement `setActiveThreadId` action

### 1.4 Layout
- [x] Create `App` component with main layout structure
- [x] Create `Header` component (placeholder)
- [x] Create `EditorPanel` component wrapper (70% width)
- [x] Create `ThreadPanel` component wrapper (30% width)
- [x] Create `StatusBar` component (placeholder)
- [x] Implement responsive split layout with Tailwind

### 1.5 Monaco Integration
- [x] Set up Monaco Editor with basic configuration
- [x] Configure dark theme (VS Dark) as default
- [x] Enable line numbers
- [x] Set up `onDidChangeCursorSelection` listener
- [x] Connect selection changes to Zustand store
- [x] Test with sample code paste

---

## Phase 2: Thread Creation

### 2.1 Selection Action Button
- [x] Create `SelectionActionButton` component
- [x] Position button near selection end using Monaco coordinates
- [x] Show/hide based on active selection state
- [x] Style button with Tailwind (floating, accent color)
- [x] Add click handler to trigger thread creation
- [x] Implement keyboard shortcut (Cmd/Ctrl + Shift + A)

### 2.2 Thread Data Management
- [x] Implement `createThread` action in store
- [x] Generate UUID for new threads
- [x] Capture selected text snapshot on creation
- [x] Implement `addMessage` action
- [x] Implement `getActiveThread` selector

### 2.3 Thread Panel UI
- [x] Create `ThreadPanel` component structure
- [x] Create `ThreadHeader` component (line range, resolve button)
- [x] Create `CodeSnapshot` component (collapsible, syntax highlighted)
- [x] Create `MessageList` component
- [x] Create `MessageBubble` component (user vs assistant styling)
- [x] Create `MessageInput` component (textarea with submit)
- [x] Handle Enter to submit, Shift+Enter for newline

### 2.4 Gutter Markers
- [x] Research Monaco gutter decoration API
- [x] Create decoration for active thread lines
- [x] Style marker icon (colored circle)
- [x] Apply decorations when threads exist
- [x] Update decorations when threads change

### 2.5 Empty States
- [x] Create empty state for no code ("Paste or type code to get started")
- [x] Create empty state for no threads ("Select code and ask AI for feedback")
- [x] Create empty state for no active thread

---

## Phase 3: AI Integration

### 3.1 API Setup
- [x] Create `/utils/api.ts` for Anthropic API calls
- [x] Set up environment variable for API key (`VITE_ANTHROPIC_API_KEY`)
- [x] Create base API request function with error handling
- [x] Implement 30-second timeout
- [x] Add `.env.example` file

### 3.2 Prompt Construction
- [x] Create `/utils/prompt.ts` for prompt building
- [x] Implement system message template (expert code reviewer)
- [x] Implement function to prepend line numbers to code
- [x] Implement function to mark selected lines in context
- [x] Implement context window management based on file size
- [x] Build conversation history formatting

### 3.3 API Integration
- [x] Create `sendMessage` async action in store
- [x] Set loading state during API call
- [x] Handle successful response (add assistant message)
- [x] Handle API errors (show in thread)
- [x] Handle timeout (show retry option)

### 3.4 Message Display
- [x] Install markdown renderer (`react-markdown`)
- [x] Configure syntax highlighting for code blocks (`react-syntax-highlighter`)
- [x] Render assistant messages with markdown
- [x] Style code blocks appropriately
- [x] Add loading skeleton/shimmer state

### 3.5 Conversation Flow
- [x] Enable follow-up messages in existing thread
- [x] Include conversation history in subsequent API calls
- [x] Maintain thread context across messages
- [x] Test multi-turn conversations

---

## Phase 4: Multi-Thread Support

### 4.1 Thread List
- [x] Create `ThreadList` component
- [x] Display all threads with line range and preview
- [x] Show status indicator (active/resolved)
- [x] Style active thread differently in list
- [x] Handle click to switch active thread

### 4.2 Thread Switching
- [x] Implement `switchThread` action
- [x] Update active thread state on switch
- [x] Scroll editor to thread's line range
- [x] Briefly highlight relevant lines on switch

### 4.3 Multiple Gutter Markers
- [x] Support multiple decorations for different threads
- [x] Style active thread marker (bright accent)
- [x] Style inactive thread markers (muted color)
- [x] Handle click on gutter marker to switch thread
- [x] Update decorations on thread switch

### 4.4 Thread Navigation
- [x] Add "Previous/Next Thread" navigation
- [x] Implement jump-to-thread from list click
- [x] Smooth scroll animation to thread location

---

## Phase 5: Polish

### 5.1 Resolve Thread
- [x] Add "Resolve" button to thread header
- [x] Implement `resolveThread` action
- [x] Move resolved threads to collapsed section
- [x] Style resolved gutter marker (dimmed/checkmark)
- [x] Allow reopening resolved threads

### 5.2 Edge Case Handling
- [x] Detect code changes after thread creation
- [x] Show "Code has changed" warning banner
- [x] Handle overlapping selections gracefully
- [x] Warn on very long selections (100+ lines)
- [x] Implement request queue for rapid-fire requests
- [x] Add retry button on API errors

### 5.3 Header Component
- [x] Implement language selector dropdown
- [x] Implement editable file name
- [x] Add theme toggle (dark/light)
- [x] Add minimap toggle

### 5.4 Status Bar
- [x] Display current line/column
- [x] Display detected language
- [x] Display thread count

### 5.5 Keyboard Shortcuts
- [x] Cmd/Ctrl + Shift + A: Ask AI about selection
- [x] Escape: Clear selection / close thread
- [x] Cmd/Ctrl + Enter: Submit message
- [x] Add keyboard shortcut hints to UI

### 5.6 Quick Action Chips
- [x] Create quick action buttons above input
- [x] "Explain this" preset
- [x] "Find bugs" preset
- [x] "Suggest improvements" preset
- [x] Insert preset text on click

### 5.7 Final Polish
- [x] Review all loading states
- [x] Review all error states
- [x] Test full user flows end-to-end
- [x] Performance check with large files
- [x] Cross-browser testing

### 5.8 Documentation
- [x] Write README with setup instructions
- [x] Document environment variables
- [x] Add usage examples
- [x] Include screenshots

---

## Verification Checklist

- [x] Can paste code and see syntax highlighting
- [x] Can select lines and create a thread
- [x] AI responds with contextually relevant feedback
- [x] Can have multi-turn conversation in a thread
- [x] Can create 3+ threads on different code sections
- [x] Can navigate between threads seamlessly
- [x] Visual indicators show where threads exist
