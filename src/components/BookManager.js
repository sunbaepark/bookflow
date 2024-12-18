'use client'

import { useState, useEffect } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'

export default function BookManager({ standalone = false, libraryId }) {
  const { selectedLibrary, addBook, removeBook, books, setBooks } = useLibrary()
  const [isLoading, setIsLoading] = useState(false)
  const [newBook, setNewBook] = useState({ title: "", status: "대출가능" })

  const effectiveLibraryId = standalone ? libraryId : selectedLibrary?._id

  useEffect(() => {
    if (effectiveLibraryId) {
      fetchBooks(effectiveLibraryId)
    }
  }, [effectiveLibraryId])

  const fetchBooks = async (libId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/books?libraryId=${libId}`)
      if (!response.ok) throw new Error('도서 목록을 가져오는데 실패했습니다')
      const data = await response.json()
      if (Array.isArray(data)) {
        setBooks(data)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!newBook.title.trim() || !effectiveLibraryId) return

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBook,
          libraryId: effectiveLibraryId
        }),
      })

      if (!response.ok) throw new Error('도서 추가에 실패했습니다')
      const { book } = await response.json()
      if (book) {
        addBook(book)
        setNewBook({ title: "", status: "대출가능" })
      }
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`/api/books?id=${bookId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        removeBook(bookId)
      } else {
        throw new Error(data.error || '도서 삭제에 실패했습니다')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <form onSubmit={handleAddBook} className="flex gap-4">
          <input
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
            placeholder="도서명을 입력하세요"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <select
            value={newBook.status}
            onChange={(e) => setNewBook(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="대출가능">대출가능</option>
            <option value="대출중">대출중</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            추가
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-zinc-500">도서 목록을 불러오는 중...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">등록된 도서가 없습니다</div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book._id} className="py-4 flex justify-between items-center border-b last:border-b-0">
                  <div>
                    <h3 className="font-medium text-zinc-800">{book.title}</h3>
                    <p className={`text-sm mt-1 ${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                      {book.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
