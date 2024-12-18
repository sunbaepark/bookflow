'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LibraryContext = createContext()

export function LibraryProvider({ children }) {
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  const [selectedBooks, setSelectedBooks] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    setSelectedBooks([])
  }, [selectedLibrary])

  const fetchBooks = async (libraryId) => {
    if (!libraryId) return

    try {
      const response = await fetch(`/api/books?libraryId=${libraryId}`)
      if (!response.ok) throw new Error('도서 목록을 가져오는데 실패했습니다')
      const data = await response.json()
      setBooks(data)

      setSelectedBooks(prev =>
        prev.filter(selectedBook =>
          data.some(book => book._id === selectedBook._id)
        )
      )
    } catch (error) {
      console.error('도서 목록 로딩 실패:', error)
      setBooks([])
    }
  }

  const addBook = (book) => {
    setBooks(prev => [...prev, book])
  }

  const removeBook = (bookId) => {
    setBooks(prev => prev.filter(book => book._id !== bookId))
    setSelectedBooks(prev => prev.filter(book => book._id !== bookId))
  }

  const value = {
    selectedLibrary,
    setSelectedLibrary,
    selectedBooks,
    setSelectedBooks,
    books,
    setBooks,
    addBook,
    removeBook,
    fetchBooks
  }

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider')
  }
  return context
} 
