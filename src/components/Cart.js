'use client'

import { useState, useEffect } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'

export default function Cart({ selectedBooks, setSelectedBooks }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (selectedBooks.length === 0) {
      setIsDrawerOpen(false)
    }
  }, [selectedBooks])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isDrawerOpen])

  return (
    <>
      <div className="hidden lg:flex flex-col h-screen bg-white border-l shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-800">선택된 도서</h2>
            <div className="flex items-center justify-center bg-zinc-800 text-white rounded-full w-6 h-6 text-sm font-bold">
              {selectedBooks.length}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-center">선택된 도서가 없습니다</p>
              <p className="text-center text-sm mt-1">도서를 선택해주세요</p>
            </div>
          ) : (
            selectedBooks.map((book) => (
              <div
                key={book._id}
                className="flex justify-between items-center mb-4 p-3 bg-zinc-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-zinc-800">{book.title}</h3>
                  <p className={`text-sm ${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                    {book.status}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooks(prev => prev.filter(b => b._id !== book._id))}
                  className="text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className={`w-full py-4 font-bold transition-colors ${selectedBooks.length === 0
            ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed'
            : 'bg-zinc-800 hover:bg-zinc-900 text-white'
            }`}
          disabled={selectedBooks.length === 0}
        >
          경로 찾기
        </button>
      </div>

      <div className="lg:hidden">
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsDrawerOpen(false)} />
        )}

        <div className={`fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'} z-50`}>
          <div className="bg-white h-[80vh] rounded-t-3xl shadow-lg flex flex-col">
            <div className="p-4 border-b sticky top-0 bg-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-zinc-800">선택된 도서 ({selectedBooks.length})</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-zinc-500 hover:text-zinc-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-center">선택된 도서가 없습니다</p>
                  <p className="text-center text-sm mt-1">도서를 선택해주세요</p>
                </div>
              ) : (
                selectedBooks.map((book) => (
                  <div
                    key={book._id}
                    className="flex justify-between items-center mb-4 p-3 bg-zinc-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-zinc-800">{book.title}</h3>
                      <p className={`text-sm ${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                        {book.status}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooks(prev => prev.filter(b => b._id !== book._id))}
                      className="text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <button
                className={`w-full py-4 rounded-lg font-bold transition-colors ${selectedBooks.length === 0
                  ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-zinc-900 text-white'
                  }`}
                disabled={selectedBooks.length === 0}
                onClick={() => {
                  if (selectedBooks.length > 0) {
                    console.log("경로 찾기 실행")
                  }
                }}
              >
                경로 찾기
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={() => {
              if (selectedBooks.length > 0) {
                setIsDrawerOpen(true)
              }
            }}
            className="relative w-full py-4 rounded-lg font-bold transition-colors group"
            disabled={selectedBooks.length === 0}
          >
            <div className={`w-full flex items-center justify-center gap-2 ${selectedBooks.length === 0
              ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed'
              : 'bg-zinc-800 hover:bg-zinc-900 text-white'
              } rounded-lg py-4`}>
              <span>선택된 도서</span>
              {selectedBooks.length > 0 && (
                <div className="flex items-center justify-center bg-white text-zinc-800 rounded-full w-6 h-6 text-sm font-bold">
                  {selectedBooks.length}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  )
} 
