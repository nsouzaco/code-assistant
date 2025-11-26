import { useEditorStore } from '../store'
import ThreadHeader from './ThreadHeader'
import CodeSnapshot from './CodeSnapshot'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ThreadList from './ThreadList'

export default function ThreadPanel() {
  const { getActiveThread, sendMessage, threads, archivedThreads } = useEditorStore()
  const activeThread = getActiveThread()

  const allThreads = [...threads, ...archivedThreads]

  const handleSendMessage = (content: string) => {
    if (!activeThread) return
    sendMessage(activeThread.id, content)
  }

  if (!activeThread) {
    return (
      <div className="w-[30%] h-full bg-gray-800 flex flex-col">
        {allThreads.length > 0 && <ThreadList threads={allThreads} />}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-500 text-sm">
            <p>Select code and ask AI for feedback</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[30%] h-full bg-gray-800 flex flex-col">
      {allThreads.length > 1 && <ThreadList threads={allThreads} />}
      <ThreadHeader thread={activeThread} />
      <CodeSnapshot
        code={activeThread.selectedText}
        language={activeThread.language}
        startLine={activeThread.startLine}
      />
      <MessageList messages={activeThread.messages} thread={activeThread} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}
