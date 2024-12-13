'use client'

import { useState, useEffect } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'

export default function LibraryDropdown() {
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false)
  const [libraries, setLibraries] = useState([])
  const { selectedLibrary, setSelectedLibrary } = useLibrary()

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
    <div className="w-[200px] relative z-[1000]">
      <div
        className="hidden sm:block relative"
        onMouseEnter={() => setIsLibraryMenuOpen(true)}
        onMouseLeave={() => setIsLibraryMenuOpen(false)}
      >
        <div className={`bg-zinc-800 px-4 py-3 rounded-b-2xl shadow-md transition-all duration-200 flex justify-center ${isLibraryMenuOpen ? 'bg-zinc-900 rounded-b-none' : ''}`}>
          <span className="text-white text-lg font-bold cursor-pointer whitespace-nowrap">
            {selectedLibrary?.name || '도서관 선택'}
          </span>
        </div>

        {isLibraryMenuOpen && (
          <div className="absolute left-0 right-0 animate-slideDown origin-top">
            {sortedLibraries.map((library, index, arr) => (
              <div
                key={library._id}
                onClick={() => handleLibrarySelect(library)}
                className={`bg-zinc-800 px-4 py-3 cursor-pointer hover:bg-zinc-900 active:bg-zinc-900 transition-colors shadow-md flex justify-center
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

      <div
        className="sm:hidden relative"
        onClick={() => setIsLibraryMenuOpen(!isLibraryMenuOpen)}
      >
        <div className={`bg-zinc-800 px-4 py-3 rounded-b-2xl shadow-md transition-all duration-200 flex justify-center ${isLibraryMenuOpen ? 'bg-zinc-900 rounded-b-none' : ''}`}>
          <span className="text-white text-lg font-bold cursor-pointer whitespace-nowrap">
            {selectedLibrary?.name || '도서관 선택'}
          </span>
        </div>

        {isLibraryMenuOpen && (
          <div className="absolute left-0 right-0 animate-slideDown origin-top">
            {sortedLibraries.map((library, index, arr) => (
              <div
                key={library._id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLibrarySelect(library)
                }}
                className={`bg-zinc-800 px-4 py-3 cursor-pointer hover:bg-zinc-900 active:bg-zinc-900 transition-colors shadow-md flex justify-center
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
    </div>
  )
}
