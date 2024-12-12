'use client'

import { useState, useEffect } from "react"

export default function LibraryDropdown() {
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  const [libraries, setLibraries] = useState([])

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch('/api/libraries')
        if (!response.ok) throw new Error('도서관 목록을 가져오는데 실패했습니다')
        const data = await response.json()
        setLibraries(data)
        if (!selectedLibrary && data.length > 0) {
          setSelectedLibrary(data[0])
        }
      } catch (error) {
        console.error('도서관 데이터 로딩 실패:', error)
      }
    }
    fetchLibraries()
  }, [])

  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library)
    setIsLibraryMenuOpen(false)
  }

  const sortedLibraries = libraries
    .filter(lib => lib._id !== selectedLibrary?._id)
    .sort((a, b) => a.name.localeCompare(b.name, "ko"))

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsLibraryMenuOpen(true)}
      onMouseLeave={() => setIsLibraryMenuOpen(false)}
    >
      <div className={`bg-zinc-800 px-14 py-3 rounded-b-2xl shadow-md transition-all duration-200 flex justify-center ${isLibraryMenuOpen ? 'bg-zinc-900 rounded-b-none' : ''}`}>
        <span className="text-white text-lg font-bold cursor-pointer whitespace-nowrap">
          {selectedLibrary?.name || '도서관 선택'}
        </span>
      </div>

      {isLibraryMenuOpen && (
        <div className="absolute top-full left-0 w-full animate-slideDown origin-top">
          {sortedLibraries.map((library, index, arr) => (
            <div
              key={library._id}
              onClick={() => handleLibrarySelect(library)}
              className={`bg-zinc-800 px-14 py-3 cursor-pointer hover:bg-zinc-900 transition-colors shadow-md flex justify-center
                ${index === arr.length - 1 ? 'rounded-b-2xl' : ''}`}
            >
              <span className="text-white text-lg font-bold whitespace-nowrap">
                {library.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
