# AI Code Review Assistant — PRD v1.0

## Product Vision

A focused, single-purpose tool where developers get AI-powered code review feedback anchored to specific code selections. The experience should feel like pair programming with a knowledgeable colleague who can see exactly what you're pointing at.

---

## Technical Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Editor | Monaco Editor | VS Code's engine. Excellent selection API, built-in syntax highlighting for 70+ languages, line numbers, minimap. Battle-tested. |
| Framework | React 18 | Familiar, good state patterns, Monaco-React wrapper available |
| State | Zustand | Lightweight, no boilerplate, perfect for this scale |
| Styling | Tailwind CSS | Rapid iteration, consistent design, utility-first |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Excellent at code understanding, fast, good at following formatting instructions |
| Build | Vite | Fast dev server, simple config |

---

## Information Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Language selector, File name (editable), Actions   │
├─────────────────────────────────────────────────────────────┤
│                    │                                        │
│                    │                                        │
│   Monaco Editor    │      Thread Panel                      │
│   (70% width)      │      (30% width)                       │
│                    │                                        │
│   - Code input     │      - Active threads list             │
│   - Line numbers   │      - Selected thread conversation    │
│   - Gutter markers │      - Input for follow-up             │
│   - Selection      │                                        │
│     highlighting   │                                        │
│                    │                                        │
├─────────────────────────────────────────────────────────────┤
│  Status bar: Line/Col, Language detected, Thread count      │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Thread

| Field | Type | Description |
|-------|------|-------------|
| id | string (uuid) | Unique identifier |
| startLine | number | First line of selection (1-indexed) |
| endLine | number | Last line of selection (1-indexed) |
| selectedText | string | Snapshot of selected code at creation |
| language | string | Programming language |
| messages | Message[] | Conversation history |
| status | 'active' \| 'resolved' | Thread state |
| createdAt | timestamp | When thread was created |

### Message

| Field | Type | Description |
|-------|------|-------------|
| id | string (uuid) | Unique identifier |
| role | 'user' \| 'assistant' | Who sent it |
| content | string | Message text |
| timestamp | timestamp | When sent |

### EditorState

| Field | Type | Description |
|-------|------|-------------|
| code | string | Full file content |
| language | string | Current language mode |
| fileName | string | Display name |
| threads | Thread[] | All threads |
| activeThreadId | string \| null | Currently focused thread |
| currentSelection | Selection \| null | Live selection state |

---

## User Flows

### Flow 1: Create First Thread

1. User pastes code into editor
2. Language auto-detects (or user selects manually)
3. User highlights lines 12-18 with mouse/keyboard
4. Floating action button appears near selection → "Ask AI"
5. Click opens thread panel with input focused
6. User types question: "Is this the most efficient approach?"
7. Submit → Loading state with skeleton
8. AI response appears in thread
9. Gutter shows marker on lines 12-18 indicating active thread

### Flow 2: Continue Conversation

1. User reads AI response in thread panel
2. Types follow-up: "Can you show me how to handle the edge case for empty arrays?"
3. Submit → AI responds with context of full conversation
4. Conversation continues indefinitely

### Flow 3: Multiple Threads

1. User has existing thread on lines 12-18
2. Selects different code: lines 45-52
3. Creates new thread → Panel switches to new thread
4. Gutter now shows two markers (different visual treatment)
5. Thread list shows both threads with preview
6. Clicking gutter marker or thread list item switches active thread

### Flow 4: Navigate Between Threads

1. User clicks thread in sidebar list
2. Editor scrolls to relevant lines
3. Lines highlight briefly to draw attention
4. Thread conversation shows in panel

### Flow 5: Resolve Thread

1. User satisfied with AI feedback
2. Clicks "Resolve" on thread
3. Thread moves to "Resolved" section (collapsed by default)
4. Gutter marker changes style (dimmed/different color)

---

## AI Context Strategy

### Prompt Structure

For each AI request, construct context as follows:

**System Message:**
- Role: Expert code reviewer
- Behavior: Concise, actionable feedback
- Format: Markdown allowed, keep responses focused

**User Message Contains:**
- Language identifier
- Full file content (with line numbers prepended)
- Selected line range highlighted/marked
- The user's specific question
- Conversation history for follow-ups

### Context Window Management

| File Size | Strategy |
|-----------|----------|
| < 500 lines | Send entire file |
| 500-2000 lines | Send selection + 100 lines above/below + file summary |
| > 2000 lines | Send selection + enclosing function/class + imports + file summary |

### Language Detection

Monaco provides this automatically. Fall back to file extension, then to user selection.

---

## UI/UX Specifications

### Editor Panel

- Monaco with dark theme (VS Dark) as default, toggle for light
- Line numbers always visible
- Gutter width accommodates thread markers
- Selection highlight with distinct background color
- Minimap optional (toggle)

### Thread Markers (Gutter)

- Small colored circles/icons in gutter
- Active thread: Bright accent color (blue)
- Other threads: Muted color (gray-blue)
- Resolved: Dimmed with checkmark
- Hover: Shows thread preview tooltip
- Click: Activates that thread

### Selection Action Button

- Appears near selection end when text selected
- Small floating button: "Ask AI" or similar
- Keyboard shortcut: Cmd/Ctrl + Shift + A
- Disappears when selection cleared

### Thread Panel

- Header: Thread location "Lines 12-18" + resolve button + close button
- Code snapshot: Collapsible preview of original selection (syntax highlighted)
- Messages: Chat-style bubbles, user right-aligned, AI left-aligned
- Input: Textarea at bottom, submit on Enter (Shift+Enter for newline)
- Loading: Skeleton/shimmer in AI message area

### Thread List (when multiple threads exist)

- Appears above active thread
- Each item shows: Line range, first user message preview, status indicator
- Click to switch
- Drag to reorder (nice-to-have)

### Empty States

- No code: "Paste or type code to get started"
- Code but no threads: "Select code and ask AI for feedback"
- No selection: Hide action button

---

## Edge Cases & Handling

| Scenario | Handling |
|----------|----------|
| Overlapping selections | Allow it. Markers stack in gutter. Visual overlap is fine. |
| Code edited after thread created | Show warning banner on thread: "Code has changed since this thread was created." Keep thread functional but flag staleness. |
| Very long selection (100+ lines) | Allow but warn: "Large selections may result in less focused feedback" |
| Empty selection | Don't show action button |
| API error | Show error in thread with retry button |
| API timeout | 30s timeout, show message, allow retry |
| Rapid-fire requests | Queue them, show pending state |
| Single line selection | Fully supported, no special handling |

---

## Implementation Phases

### Phase 1: Foundation (1.5 hours)

- Project setup: Vite + React + Tailwind
- Monaco integration with basic config
- Core state structure with Zustand
- Layout: Editor + Panel split view
- Selection tracking from Monaco

### Phase 2: Thread Creation (1.5 hours)

- Floating action button on selection
- Thread creation flow
- Thread panel UI (static first)
- Gutter marker rendering
- Thread data model implementation

### Phase 3: AI Integration (1.5 hours)

- Anthropic API integration
- Prompt construction with context
- Streaming responses (nice to have) or loading states
- Message display with markdown rendering
- Follow-up conversation support

### Phase 4: Multi-Thread Support (1 hour)

- Thread list UI
- Thread switching
- Scroll-to-thread in editor
- Multiple gutter markers
- Active thread highlighting

### Phase 5: Polish (1 hour)

- Resolve thread functionality
- Edge case handling
- Keyboard shortcuts
- Error states
- README documentation

---

## Success Metrics (Demo Validation)

- [ ] Can paste code and see syntax highlighting
- [ ] Can select lines and create a thread
- [ ] AI responds with contextually relevant feedback
- [ ] Can have multi-turn conversation in a thread
- [ ] Can create 3+ threads on different code sections
- [ ] Can navigate between threads seamlessly
- [ ] Visual indicators show where threads exist

---

## Future Considerations (Out of Scope)

- **Apply suggestions**: AI proposes diff, user clicks to apply
- **Persistence**: LocalStorage or backend for saving sessions
- **Export**: Generate review summary document
- **Multi-file**: Project/folder support
- **Collaboration**: Real-time shared sessions
- **Git integration**: PR-style review workflow

---

## Open Design Questions

### 1. Thread on edit behavior

Should we try to "follow" the code (recompute line numbers) or just flag as stale?

> **Recommendation**: Flag as stale for MVP. True following requires AST parsing.

### 2. Response length

Should AI be instructed to keep responses short, or allow detailed explanations?

> **Recommendation**: Default concise, user can ask "explain in more detail"

### 3. Pre-built prompts

Should we offer quick actions like "Explain this", "Find bugs", "Suggest improvements"?

> **Recommendation**: Yes, as quick-action chips above input. Reduces friction.
