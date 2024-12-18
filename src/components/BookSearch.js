"use client"

import { useState, useEffect, useMemo } from "react"
import { useLibrary } from "@/contexts/LibraryContext"
import { getChoseong } from 'es-hangul'
import Cart from "./Cart"

const searchBooks = (books, query) => {
  if (!query) return books

  const searchText = query.toLowerCase()
  const searchChoseong = getChoseong(query)

  return books.filter(book => {
    const titleLower = book.title.toLowerCase()
    const titleChoseong = getChoseong(book.title)

    return titleLower.includes(searchText) || titleChoseong.includes(searchChoseong)
  })
}

export default function BookSearch({ searchQuery, setSearchQuery }) {
  const { selectedLibrary, selectedBooks = [], setSelectedBooks, books, setBooks } = useLibrary()

  useEffect(() => {
    const fetchBooks = async () => {
      if (!selectedLibrary?._id) {
        setBooks([])
        return
      }

      try {
        const response = await fetch(`/api/books?libraryId=${selectedLibrary._id}`)
        if (!response.ok) throw new Error('도서 목록을 가져오는데 실패했습니다')
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('도서 목록 로딩 실패:', error)
        setBooks([])
      }
    }

    fetchBooks()
  }, [selectedLibrary])

  const searchResults = useMemo(() => {
    return searchBooks(books, searchQuery)
  }, [books, searchQuery])

  const isBookSelected = (bookId) => {
    return Array.isArray(selectedBooks) && selectedBooks.some(book => book._id === bookId)
  }

  const handleBookSelect = (book) => {
    setSelectedBooks(prev => {
      const currentSelected = Array.isArray(prev) ? prev : []

      const isAlreadySelected = currentSelected.some(b => b._id === book._id)

      if (isAlreadySelected) {
        return currentSelected.filter(b => b._id !== book._id)
      } else {
        return [...currentSelected, book]
      }
    })
  }

  return (
    <div className="py-4">
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
  )
}
