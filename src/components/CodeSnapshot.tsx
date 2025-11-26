import { useState } from 'react'

interface CodeSnapshotProps {
  code: string
  language: string
  startLine: number
}

export default function CodeSnapshot({ code, startLine }: CodeSnapshotProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="border-b border-gray-600">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 flex items-center gap-2 transition-colors"
      >
        <span>{isCollapsed ? '▶' : '▼'}</span>
        <span>Code Snapshot</span>
      </button>
      {!isCollapsed && (
        <pre className="p-3 bg-gray-900 text-xs text-gray-300 overflow-x-auto">
          {code.split('\n').map((line, idx) => (
            <div key={idx} className="flex">
              <span className="text-gray-500 mr-3 select-none">{startLine + idx}</span>
              <code>{line}</code>
            </div>
          ))}
        </pre>
      )}
    </div>
  )
}
