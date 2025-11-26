import { useState } from 'react'
import { useEditorStore } from '../store'
import { generateFeedbackReport, generateFeedbackJSON, downloadFile } from '../utils/exportFeedback'

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'shell',
  'html',
  'css',
  'json',
  'yaml',
  'sql',
  'markdown',
]

export default function Header() {
  const { fileName, setFileName, language, setLanguage, threads, archivedThreads, code, autoDetectLanguage } = useEditorStore()
  const [showExportMenu, setShowExportMenu] = useState(false)

  const allThreads = [...threads, ...archivedThreads]
  const hasThreads = allThreads.length > 0

  const handleExportMarkdown = () => {
    const report = generateFeedbackReport(allThreads, fileName, code)
    const exportFileName = fileName.replace(/\.[^.]+$/, '') + '-review.md'
    downloadFile(report, exportFileName, 'text/markdown')
    setShowExportMenu(false)
  }

  const handleExportJSON = () => {
    const json = generateFeedbackJSON(allThreads, fileName, code)
    const exportFileName = fileName.replace(/\.[^.]+$/, '') + '-review.json'
    downloadFile(json, exportFileName, 'application/json')
    setShowExportMenu(false)
  }

  const handleAutoDetect = () => {
    autoDetectLanguage()
  }

  return (
    <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        placeholder="filename.ts"
      />
      
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          onClick={handleAutoDetect}
          className="text-xs text-gray-400 hover:text-blue-400 transition-colors px-2 py-1"
          title="Auto-detect language from file name and content"
        >
          Auto
        </button>
      </div>

      <div className="flex-1" />

      {/* Export button */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={!hasThreads}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
            hasThreads
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>

        {showExportMenu && hasThreads && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowExportMenu(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-lg shadow-xl border border-gray-600 z-20 overflow-hidden">
              <button
                onClick={handleExportMarkdown}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
              >
                <span className="text-blue-400">📄</span>
                Export as Markdown
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
              >
                <span className="text-yellow-400">{ }</span>
                Export as JSON
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-gray-400">
        <span>Cmd/Ctrl+Shift+A: Ask AI</span>
      </div>
    </header>
  )
}
