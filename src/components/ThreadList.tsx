import { Thread } from '../types'
import { useEditorStore } from '../store'

interface ThreadListProps {
  threads: Thread[]
}

export default function ThreadList({ threads }: ThreadListProps) {
  const { activeThreadId, switchThread } = useEditorStore()

  if (threads.length === 0) return null

  const activeThreads = threads.filter((t) => t.status === 'active' && !t.isStale)
  const staleThreads = threads.filter((t) => t.status === 'active' && t.isStale)
  const resolvedThreads = threads.filter((t) => t.status === 'resolved')

  return (
    <div className="border-b border-gray-700 bg-gray-750 max-h-48 overflow-y-auto">
      {activeThreads.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 px-3 py-2 sticky top-0 bg-gray-800">
            Active Threads
          </div>
          {activeThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => switchThread(thread.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                thread.id === activeThreadId ? 'bg-gray-700 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Lines {thread.startLine}-{thread.endLine}
                </span>
                <span className="text-xs text-gray-500">{thread.messages.length} msgs</span>
              </div>
              {thread.messages.length > 0 && (
                <div className="text-xs text-gray-500 truncate mt-1">
                  {thread.messages[0].content}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {staleThreads.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-yellow-500/80 px-3 py-2 sticky top-0 bg-gray-800 flex items-center gap-1">
            <span className="text-yellow-500">⚠</span> Code Changed
          </div>
          {staleThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => switchThread(thread.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors opacity-75 ${
                thread.id === activeThreadId ? 'bg-gray-700 border-l-2 border-yellow-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Lines {thread.startLine}-{thread.endLine}
                  <span className="text-yellow-500/70 ml-1">(stale)</span>
                </span>
                <span className="text-xs text-gray-500">{thread.messages.length} msgs</span>
              </div>
              {thread.messages.length > 0 && (
                <div className="text-xs text-gray-500 truncate mt-1">
                  {thread.messages[0].content}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {resolvedThreads.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 px-3 py-2 sticky top-0 bg-gray-800">
            Resolved
          </div>
          {resolvedThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => switchThread(thread.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors opacity-60 ${
                thread.id === activeThreadId ? 'bg-gray-700 border-l-2 border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Lines {thread.startLine}-{thread.endLine}
                </span>
                <span className="text-xs text-green-600">✓</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
