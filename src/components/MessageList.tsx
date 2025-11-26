import { useEffect, useRef } from 'react'
import { Message, Thread } from '../types'
import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: Message[]
  thread: Thread
}

export default function MessageList({ messages, thread }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500 text-sm">
          <p>Ask a question about the selected code</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} thread={thread} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
