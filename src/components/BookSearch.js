"use client"

import { useState, useEffect, useMemo } from "react"
import { useLibrary } from "@/contexts/LibraryContext"
import Cart from "./Cart"

export default function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedBooks, setSelectedBooks] = useState([])
  const { selectedLibrary } = useLibrary()

  useEffect(() => {
    if (!selectedLibrary) return

    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `/api/books?libraryId=${selectedLibrary._id}&query=${searchQuery}`
        )
        if (!response.ok) throw new Error('도서 목록을 가져오는데 실패했습니다')
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error('도서 데이터 로딩 실패:', error)
      }
    }

    const debounceTimer = setTimeout(fetchBooks, 300)

    return () => clearTimeout(debounceTimer)
  }, [selectedLibrary, searchQuery])

  const isBookSelected = (bookId) => {
    return selectedBooks.some(book => book._id === bookId)
  }

  const handleBookSelect = (book) => {
    if (isBookSelected(book._id)) {
      setSelectedBooks(prev => prev.filter(b => b._id !== book._id))
    } else {
      setSelectedBooks(prev => [...prev, book])
    }
  }

  return (
    <div className="relative">
      <div className="lg:mr-80">
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도서명을 입력하세요"
            className="w-full px-4 py-2 bg-transparent border-b-2 border-zinc-300 focus:border-zinc-800 focus:outline-none transition-colors font-[NoonnuBasicGothic] text-lg placeholder:text-zinc-400 placeholder:transition-opacity focus:placeholder:opacity-0"
          />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 lg:pr-80">
          {searchResults.map((book) => (
            <div
              key={book._id}
              className={`flex justify-between items-center p-4 border rounded-lg hover:bg-zinc-50 active:scale-[0.98] cursor-pointer transition-all duration-200 ease-out mb-4
                ${isBookSelected(book._id)
                  ? 'bg-zinc-100 border-zinc-400'
                  : 'border-zinc-200'
                }`}
              onClick={() => handleBookSelect(book)}
            >
              <div>
                <h3 className="font-medium text-zinc-800">{book.title}</h3>
                <div className="flex gap-3 mt-1 text-sm">
                  <span className={`${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                    {book.status}
                  </span>
                </div>
              </div>
              {isBookSelected(book._id) && (
                <div className="text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:block fixed top-0 right-0 w-80 h-screen">
          <Cart selectedBooks={selectedBooks} setSelectedBooks={setSelectedBooks} />
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0">
        <Cart selectedBooks={selectedBooks} setSelectedBooks={setSelectedBooks} />
      </div>
    </div>
  )
}
