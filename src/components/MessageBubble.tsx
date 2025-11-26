import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message, Thread } from '../types'
import { useEditorStore } from '../store'
import DiffView from './DiffView'
import type { Components } from 'react-markdown'

interface MessageBubbleProps {
  message: Message
  thread: Thread
}

export default function MessageBubble({ message, thread }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const { applyCodeChange } = useEditorStore()

  // Check if message has suggested code
  const hasSuggestedCode = message.suggestedCode && message.suggestedCode.length > 0

  // Remove the suggested code block from display content
  const displayContent = message.content.replace(/```suggested\n[\s\S]*?```/g, '').trim()

  const handleApplyChanges = () => {
    applyCodeChange(thread.id, message.id)
  }

  const components: Components = {
    code(props) {
      const { children, className, ...rest } = props
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" {...rest}>
          {children}
        </code>
      )
    },
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-[90%] px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
        }`}
      >
        <div className="text-sm markdown-content">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <ReactMarkdown components={components}>{displayContent}</ReactMarkdown>
          )}
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Show diff view for suggested code */}
      {hasSuggestedCode && !isUser && (
        <div className="w-full mt-2">
          <DiffView
            originalCode={thread.selectedText}
            suggestedCode={message.suggestedCode!}
            language={thread.language}
            onApply={handleApplyChanges}
          />
        </div>
      )}
    </div>
  )
}
