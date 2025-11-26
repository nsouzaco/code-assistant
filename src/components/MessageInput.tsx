import { useState, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { label: 'Explain this', text: 'Can you explain what this code does?' },
    { label: 'Find bugs', text: 'Are there any bugs or issues in this code?' },
    { label: 'Improve', text: 'How can this code be improved?' },
    { label: 'Suggest fix', text: 'Please suggest a fix for this code and provide the improved version.' },
  ]

  const handleQuickAction = (text: string) => {
    setMessage(text)
  }

  return (
    <div className="p-3 bg-gray-700 border-t border-gray-600">
      <div className="flex gap-2 mb-2 flex-wrap">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.text)}
            disabled={disabled}
            className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        className="w-full bg-gray-800 text-white p-3 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        rows={3}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Send
      </button>
    </div>
  )
}
