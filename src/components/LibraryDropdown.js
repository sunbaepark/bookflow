'use client'

import { useState, useEffect } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'

export default function LibraryDropdown() {
  const { selectedLibrary, setSelectedLibrary } = useLibrary()
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false)
  const [libraries, setLibraries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch('/api/libraries')
        if (!response.ok) throw new Error('도서관 목록을 가져오는데 실패했습니다')
        const data = await response.json()
        const sortedLibraries = data.sort((a, b) => a.name.localeCompare(b.name))
        setLibraries(sortedLibraries)
        if (!selectedLibrary && sortedLibraries.length > 0) {
          setSelectedLibrary(sortedLibraries[0])
        }
      } catch (error) {
        console.error('도서관 목록 로딩 실패:', error)
        setLibraries([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLibraries()
  }, [])

  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library)
    setIsLibraryMenuOpen(false)
  }

  const otherLibraries = libraries.filter(library => library._id !== selectedLibrary?._id)

  return (
    <div
      className="h-full w-full relative border-x border-zinc-700/20"
      onClick={() => setIsLibraryMenuOpen(!isLibraryMenuOpen)}
    >
      <div className="h-full flex items-center justify-center hover:bg-zinc-900/90 transition-colors cursor-pointer">
        <span className="text-[15px] font-normal text-zinc-100">
          {isLoading ? '로딩중...' : selectedLibrary?.name}
        </span>
      </div>

      {isLibraryMenuOpen && otherLibraries.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 shadow-lg z-50">
          {otherLibraries.map((library) => (
            <div
              key={library._id}
              onClick={(e) => {
                e.stopPropagation();
                handleLibrarySelect(library);
              }}
              className="w-full px-6 py-3 hover:bg-zinc-900 transition-colors cursor-pointer text-center group"
            >
              <span className="text-[15px] font-normal text-zinc-100 group-hover:text-zinc-100 transition-colors">
                {library.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
