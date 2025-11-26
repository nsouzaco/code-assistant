import { Thread } from '../types'
import { useEditorStore } from '../store'

interface ThreadHeaderProps {
  thread: Thread
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
  const { resolveThread, setActiveThreadId } = useEditorStore()

  const handleResolve = () => {
    resolveThread(thread.id)
  }

  const handleClose = () => {
    setActiveThreadId(null)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">
          Lines {thread.startLine}-{thread.endLine}
        </span>
        {thread.isStale && (
          <span className="text-xs bg-yellow-600/30 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>⚠</span> Code changed
          </span>
        )}
        {thread.status === 'resolved' && (
          <span className="text-xs bg-green-600/30 text-green-400 px-2 py-0.5 rounded-full">
            Resolved
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {thread.status === 'active' && !thread.isStale && (
          <button
            onClick={handleResolve}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
          >
            Resolve
          </button>
        )}
        <button
          onClick={handleClose}
          className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
