'use client'

import { useState, useEffect } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'
import { useRouter } from 'next/navigation'

// 경로찾기 버튼 컴포넌트
const FindRouteButton = ({ selectedBooks }) => {
  const router = useRouter()
  const { selectedLibrary } = useLibrary()

  const handleFindRoute = () => {
    if (selectedBooks.length === 0) return

    const bookIds = selectedBooks.map(book => book._id).join(',')
    router.push(`/route?books=${bookIds}&libraryId=${selectedLibrary._id}`)
  }

  return (
    <button
      onClick={handleFindRoute}
      className={`w-full py-4 rounded-lg font-bold transition-colors ${selectedBooks.length === 0
          ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed'
          : 'bg-zinc-800 hover:bg-zinc-900 text-white'
        }`}
      disabled={selectedBooks.length === 0}
    >
      경로 찾기
    </button>
  )
}

export default function Cart() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { selectedBooks, setSelectedBooks } = useLibrary()

  useEffect(() => {
    const navbar = document.querySelector('.navbar')
    const applyStyles = () => {
      if (isDrawerOpen) {
        document.body.style.overflow = 'hidden'
        if (navbar) {
          navbar.style.pointerEvents = 'none'
          navbar.style.opacity = '0.5'
          navbar.style.transition = 'opacity 300ms ease-in-out'
        }
      } else {
        document.body.style.overflow = 'auto'
        if (navbar) {
          navbar.style.pointerEvents = 'auto'
          navbar.style.opacity = '1'
          navbar.style.transition = 'opacity 300ms ease-in-out'
        }
      }
    }

    applyStyles()

    return () => {
      document.body.style.overflow = 'auto'
      if (navbar) {
        navbar.style.pointerEvents = 'auto'
        navbar.style.opacity = '1'
      }
    }
  }, [isDrawerOpen])

  // 웹 뷰 컴포넌트
  const WebCart = () => (
    <div className="hidden lg:block">
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="cart-button fixed right-8 bottom-8 bg-zinc-800 hover:bg-zinc-900 text-white p-4 rounded-full shadow-lg transition-all duration-1000"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {selectedBooks.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {selectedBooks.length}
            </div>
          )}
        </div>
      </button>

      {/* 드로어 */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-800">선택된 도서</h2>
              <div className="flex items-center justify-center bg-zinc-800 text-white rounded-full w-6 h-6 text-sm font-bold">
                {selectedBooks.length}
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
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
              <div className="space-y-4">
                {selectedBooks.map((book) => (
                  <div
                    key={book._id}
                    className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-800 truncate">{book.title}</h3>
                      <p className={`text-sm ${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                        {book.status}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooks(prev => prev.filter(b => b._id !== book._id))}
                      className="ml-2 text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <FindRouteButton selectedBooks={selectedBooks} />
          </div>
        </div>
      </div>

      {/* 오버레이 배경 */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[999]"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )

  // 모바일 뷰 컴포넌트 (기존 코드 참조)
  const MobileCart = () => (
    <div className="lg:hidden">
      {/* 플로팅 버튼 */}
      <button
        onClick={() => {
          if (selectedBooks.length > 0) {
            setIsDrawerOpen(true)
          }
        }}
        className="cart-button fixed right-4 bottom-4 bg-zinc-800 hover:bg-zinc-900 text-white p-4 rounded-full shadow-lg transition-all duration-1000"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {selectedBooks.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {selectedBooks.length}
            </div>
          )}
        </div>
      </button>

      {/* 드로어 */}
      <div
        className={`fixed inset-0 transform transition-all duration-500 ease-out ${isDrawerOpen ? 'translate-y-0' : 'translate-y-[100vh]'
          } z-[1000]`}
      >
        <div className="absolute inset-x-0 bottom-0 bg-white h-[80vh] rounded-t-3xl shadow-lg flex flex-col">
          {/* 기존 드로어 내용은 그대로 유지 */}
          <div className="p-4 border-b sticky top-0 bg-white rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-800">선택된 도서</h2>
                <div className="flex items-center justify-center bg-zinc-800 text-white rounded-full w-6 h-6 text-sm font-bold">
                  {selectedBooks.length}
                </div>
              </div>
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
              <div className="space-y-4">
                {selectedBooks.map((book) => (
                  <div
                    key={book._id}
                    className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-800 truncate">{book.title}</h3>
                      <p className={`text-sm ${book.status === "대출가능" ? "text-green-600" : "text-red-600"}`}>
                        {book.status}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooks(prev => prev.filter(b => b._id !== book._id))}
                      className="ml-2 text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <FindRouteButton selectedBooks={selectedBooks} />
          </div>
        </div>
      </div>

      {/* 오버레이 배경 */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[999]"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )

  return (
    <>
      <WebCart />
      <MobileCart />
    </>
  )
} 
