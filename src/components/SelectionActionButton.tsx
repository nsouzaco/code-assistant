import { useEffect, useState, useCallback } from 'react'
import { useEditorStore } from '../store'

export default function SelectionActionButton() {
  const { currentSelection, createThread, language } = useEditorStore()
  const [isVisible, setIsVisible] = useState(false)

  // Update visibility when selection changes
  useEffect(() => {
    if (currentSelection && currentSelection.text.trim().length > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [currentSelection])

  const handleClick = useCallback(() => {
    if (currentSelection) {
      createThread(currentSelection, language)
      setIsVisible(false)
    }
  }, [currentSelection, createThread, language])

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        if (currentSelection) {
          handleClick()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSelection, handleClick])

  if (!isVisible) return null

  return (
    <div 
      className="fixed z-[9999] pointer-events-none"
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
      }}
    >
      {/* Floating button positioned at top of editor area */}
      <button
        onClick={handleClick}
        className="pointer-events-auto absolute bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-2"
        style={{ 
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask AI about selection
        <span className="text-xs text-blue-200">(⌘⇧A)</span>
      </button>
    </div>
  )
}
