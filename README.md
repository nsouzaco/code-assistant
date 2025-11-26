# AI Code Review Assistant

A focused, single-purpose tool where developers get AI-powered code review feedback anchored to specific code selections. Built with React, TypeScript, Monaco Editor, and Anthropic's Claude API.

## Features

- **Monaco Editor Integration**: Full VS Code editor experience with syntax highlighting for 70+ languages
- **Thread-Based Conversations**: Create multiple conversation threads anchored to specific lines of code
- **AI-Powered Code Review**: Get intelligent feedback from GPT-4o on code quality, bugs, and improvements
- **Visual Indicators**: Gutter markers show active and resolved threads
- **Quick Actions**: Pre-built prompts for common review tasks (explain, find bugs, suggest improvements)
- **Markdown Support**: AI responses rendered with syntax-highlighted code blocks
- **Multi-Thread Support**: Manage multiple code review threads simultaneously

## Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd code-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

1. **Paste or type code** into the Monaco editor
2. **Select lines of code** you want to review
3. **Click "Ask AI"** button or press `Cmd/Ctrl+Shift+A`
4. **Type your question** or use a quick action
5. **Get AI feedback** with actionable suggestions

### Keyboard Shortcuts

- `Cmd/Ctrl+Shift+A`: Ask AI about current selection
- `Enter`: Send message
- `Shift+Enter`: New line in message input
- `Cmd/Ctrl+Enter`: Send message (alternative)

### Tips

- Create multiple threads for different sections of code
- Use quick actions for common review tasks
- Resolve threads when issues are addressed
- Switch between threads using the thread list

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Editor**: Monaco Editor (VS Code's editor engine)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI API (GPT-4o)
- **Build Tool**: Vite
- **Markdown**: react-markdown with syntax highlighting

## Project Structure

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

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)

## License

ISC
