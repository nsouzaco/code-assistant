<div align="center">

# AI Code Review Assistant

**A focused, single-purpose tool where developers get AI-powered code review feedback anchored to specific code selections.**

<br />

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)

</div>

<br />

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Monaco Editor** | Full VS Code editor experience with syntax highlighting for 70+ languages |
| **Thread-Based Conversations** | Create multiple conversation threads anchored to specific lines of code |
| **AI-Powered Review** | Get intelligent feedback from GPT-4o on code quality, bugs, and improvements |
| **Visual Indicators** | Gutter markers show active and resolved threads |
| **Quick Actions** | Pre-built prompts for common review tasks (explain, find bugs, suggest improvements) |
| **Markdown Support** | AI responses rendered with syntax-highlighted code blocks |
| **Multi-Thread Support** | Manage multiple code review threads simultaneously |

<br />

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br />React 18
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br />TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br />Vite
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br />Tailwind v4
</td>
<td align="center" width="96">
<img src="https://cdn.simpleicons.org/openai/412991" width="48" height="48" alt="OpenAI" />
<br />GPT-4o
</td>
</tr>
</table>

| Category | Technology |
|----------|------------|
| **Editor** | Monaco Editor (VS Code's engine) |
| **State** | Zustand |
| **Markdown** | react-markdown + syntax highlighting |

<br />

## 🚀 Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd code-assistant

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Add your OpenAI API key to `.env`:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

<br />

## 📖 Usage

1. **Paste or type code** into the Monaco editor
2. **Select lines of code** you want to review
3. **Click "Ask AI"** button or press `Cmd/Ctrl+Shift+A`
4. **Type your question** or use a quick action
5. **Get AI feedback** with actionable suggestions

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+Shift+A` | Ask AI about current selection |
| `Enter` | Send message |
| `Shift+Enter` | New line in message input |
| `Cmd/Ctrl+Enter` | Send message (alternative) |

### Tips

- Create multiple threads for different sections of code
- Use quick actions for common review tasks
- Resolve threads when issues are addressed
- Switch between threads using the thread list

<br />

## 📁 Project Structure

```
src/
├── components/     # React components
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
├── utils/          # API and prompt utilities
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

<br />

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key (required) |

<br />

---

<div align="center">

**ISC License**

</div>
