import Header from './components/Header'
import EditorPanel from './components/EditorPanel'
import ThreadPanel from './components/ThreadPanel'
import StatusBar from './components/StatusBar'
import SelectionActionButton from './components/SelectionActionButton'

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel />
        <ThreadPanel />
      </div>
      <StatusBar />
      <SelectionActionButton />
    </div>
  )
}

export default App
