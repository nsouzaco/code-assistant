import { useMemo } from 'react'
import * as Diff from 'diff'

interface DiffViewProps {
  originalCode: string
  suggestedCode: string
  language: string
  onApply?: () => void
  onDismiss?: () => void
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

export default function DiffView({
  originalCode,
  suggestedCode,
  language: _language,
  onApply,
  onDismiss,
}: DiffViewProps) {
  const diffLines = useMemo(() => {
    const changes = Diff.diffLines(originalCode, suggestedCode)
    const lines: DiffLine[] = []
    let oldLineNum = 1
    let newLineNum = 1

    for (const change of changes) {
      const changeLines = change.value.split('\n')
      // Remove trailing empty string from split
      if (changeLines[changeLines.length - 1] === '') {
        changeLines.pop()
      }

      for (const line of changeLines) {
        if (change.added) {
          lines.push({
            type: 'added',
            content: line,
            newLineNumber: newLineNum++,
          })
        } else if (change.removed) {
          lines.push({
            type: 'removed',
            content: line,
            oldLineNumber: oldLineNum++,
          })
        } else {
          lines.push({
            type: 'unchanged',
            content: line,
            oldLineNumber: oldLineNum++,
            newLineNumber: newLineNum++,
          })
        }
      }
    }

    return lines
  }, [originalCode, suggestedCode])

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === 'added').length
    const removed = diffLines.filter((l) => l.type === 'removed').length
    return { added, removed }
  }, [diffLines])

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-300">Suggested Changes</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">+{stats.added}</span>
            <span className="text-red-400">-{stats.removed}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              Dismiss
            </button>
          )}
          {onApply && (
            <button
              onClick={onApply}
              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-500 text-white rounded transition-colors font-medium"
            >
              Apply Changes
            </button>
          )}
        </div>
      </div>

      {/* Diff content */}
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <tbody>
            {diffLines.map((line, idx) => (
              <tr
                key={idx}
                className={
                  line.type === 'added'
                    ? 'bg-green-900/30'
                    : line.type === 'removed'
                      ? 'bg-red-900/30'
                      : ''
                }
              >
                {/* Old line number */}
                <td className="w-10 px-2 py-0.5 text-right text-gray-500 select-none border-r border-gray-800">
                  {line.oldLineNumber || ''}
                </td>
                {/* New line number */}
                <td className="w-10 px-2 py-0.5 text-right text-gray-500 select-none border-r border-gray-800">
                  {line.newLineNumber || ''}
                </td>
                {/* Sign */}
                <td className="w-5 px-1 py-0.5 text-center select-none">
                  {line.type === 'added' ? (
                    <span className="text-green-400">+</span>
                  ) : line.type === 'removed' ? (
                    <span className="text-red-400">-</span>
                  ) : (
                    <span className="text-gray-600">&nbsp;</span>
                  )}
                </td>
                {/* Content */}
                <td
                  className={`px-2 py-0.5 whitespace-pre ${
                    line.type === 'added'
                      ? 'text-green-300'
                      : line.type === 'removed'
                        ? 'text-red-300'
                        : 'text-gray-300'
                  }`}
                >
                  {line.content || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

