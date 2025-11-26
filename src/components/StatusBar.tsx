import { useEditorStore } from '../store'

export default function StatusBar() {
  const { language, threads } = useEditorStore()

  return (
    <div className="h-6 bg-blue-600 text-white text-xs flex items-center px-4 space-x-4">
      <span>Language: {language}</span>
      <span>Threads: {threads.length}</span>
    </div>
  )
}
