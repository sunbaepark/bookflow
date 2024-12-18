'use client'

export default function MapToolbar({ selectedTool, setSelectedTool, libraryName, libraryImage }) {
  return (
    <div className="p-6 border-b flex justify-between items-center">
      <div>
        <h2 className="text-lg font-medium">맵 편집</h2>
        <p className="text-sm text-zinc-500 mt-1">{libraryName}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTool('start')}
          className={`px-4 py-2 rounded-lg ${selectedTool === 'start' ? 'bg-green-500 text-white' : 'bg-zinc-100'}`}
        >
          출발지점
        </button>
        <button
          onClick={() => setSelectedTool('end')}
          className={`px-4 py-2 rounded-lg ${selectedTool === 'end' ? 'bg-red-500 text-white' : 'bg-zinc-100'}`}
        >
          도착지점
        </button>
        <button
          onClick={() => setSelectedTool('shelf')}
          className={`px-4 py-2 rounded-lg ${selectedTool === 'shelf' ? 'bg-blue-500 text-white' : 'bg-zinc-100'}`}
        >
          책장
        </button>
        <button
          onClick={() => setSelectedTool('wall')}
          className={`px-4 py-2 rounded-lg ${selectedTool === 'wall' ? 'bg-zinc-800 text-white' : 'bg-zinc-100'}`}
        >
          장애물
        </button>
      </div>
    </div>
  )
}
