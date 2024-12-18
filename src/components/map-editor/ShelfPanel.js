'use client'

export default function ShelfPanel({
  shelves,
  setShelves,
  selectedShelf,
  setSelectedShelf,
  bookshelves,
  onSave,
  isSaving,
  saveMessage
}) {
  const handleShelfSelect = (shelfId) => {
    setSelectedShelf(shelfId)
    setShelves(shelves.map(s => ({
      ...s,
      isSelected: s.id === shelfId
    })))
  }

  const handleRemoveShelf = (shelfId, e) => {
    e.stopPropagation()
    setShelves(shelves.filter(s => s.id !== shelfId))
  }

  const handleCategoryChange = (e, shelfId) => {
    setShelves(shelves.map(shelf => 
      shelf.id === shelfId 
        ? { ...shelf, category: e.target.value }
        : shelf
    ))
  }

  return (
    <div className="w-80 border-l flex flex-col h-screen">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">책장 정보</h3>
        <button
          onClick={() => {
            // 배치되지 않은 책장 중 첫 번째를 선택
            const unusedBookshelf = bookshelves?.find(
              bookshelf => !shelves.some(shelf => shelf.id === bookshelf._id)
            )
            if (unusedBookshelf) {
              const newShelf = {
                id: unusedBookshelf._id,
                number: shelves.length + 1,
                category: unusedBookshelf.category || '미지정',
                x: 0,
                y: 0,
                isSelected: false
              }
              setShelves([...shelves, newShelf])
            } else {
              alert('배치할 수 있는 책장이 없습니다.')
            }
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          + 새 책장
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {shelves.map(shelf => (
            <div
              key={shelf.id}
              onClick={() => handleShelfSelect(shelf.id)}
              className={`p-4 rounded-lg border ${
                shelf.isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">책장 {shelf.number}</span>
                <button
                  onClick={(e) => handleRemoveShelf(shelf.id, e)}
                  className="text-red-500 hover:text-red-700"
                >
                  제거
                </button>
              </div>
              <input
                type="text"
                value={shelf.category}
                onChange={(e) => handleCategoryChange(e, shelf.id)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500"
                placeholder="카테고리 입력"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`w-full py-2 ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-lg`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
        {saveMessage && (
          <div className={`mt-2 text-center text-sm ${
            saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {saveMessage.text}
          </div>
        )}
      </div>
    </div>
  )
} 