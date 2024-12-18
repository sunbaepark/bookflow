'use client'

import { useState } from 'react'
import { useLibrary } from '@/contexts/LibraryContext'
import LibraryDropdown from './LibraryDropdown'
import MapEditor from '@/components/map-editor/MapEditor'

export default function NavigationBar() {
  const { selectedLibrary } = useLibrary()
  const { fetchBooks } = useLibrary()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleBookManagerClick = () => {
    if (selectedLibrary?._id) {
      setIsPopupOpen(true)
      document.body.style.overflow = 'hidden'

      const popup = window.open(`/bookmanager?libraryId=${selectedLibrary._id}`, '도서관리', 'width=800,height=600')

      if (popup) {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer)
            setIsPopupOpen(false)
            document.body.style.overflow = 'auto'
            fetchBooks(selectedLibrary._id)
          }
        }, 1000)
      }
    }
  }

  const handleMapEditorClick = () => {
    if (selectedLibrary?._id) {
      setIsPopupOpen(true)
      document.body.style.overflow = 'hidden'

      const popup = window.open(`/mapeditor?libraryId=${selectedLibrary._id}`, '책장배치', 'width=1024,height=768')

      if (popup) {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer)
            setIsPopupOpen(false)
            document.body.style.overflow = 'auto'
          }
        }, 1000)
      }
    }
  }

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm h-16 z-50">
        <div className="h-full w-full">
          <div className="grid grid-cols-12 h-full divide-x divide-zinc-800/20">
            <div className="col-span-3 lg:col-span-4 grid grid-cols-2 h-full divide-x divide-zinc-700/20">
              <div 
                onClick={handleMapEditorClick}
                className="w-full flex items-center justify-center hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-white group-hover:text-zinc-100 transition-colors">
                  <svg
                    className="w-[16px] h-[16px] md:w-[17px] md:h-[17px] lg:w-[18px] lg:h-[18px] xl:w-[19px] xl:h-[19px] group-hover:scale-105 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span className="hidden lg:block text-xs xl:text-sm tracking-wider font-normal text-zinc-100">책장 배치</span>
                </div>
              </div>
              <div
                onClick={handleBookManagerClick}
                className="w-full flex items-center justify-center hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-white group-hover:text-zinc-100 transition-colors">
                  <svg
                    className="w-[16px] h-[16px] md:w-[17px] md:h-[17px] lg:w-[18px] lg:h-[18px] xl:w-[19px] xl:h-[19px] group-hover:scale-105 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  <span className="hidden lg:block text-xs xl:text-sm tracking-wider font-normal text-zinc-100">도서 관리</span>
                </div>
              </div>
            </div>

            <div className="col-span-6 lg:col-span-4 grid grid-cols-1 h-full divide-x divide-zinc-700/20">
              <LibraryDropdown />
            </div>

            <div className="col-span-3 lg:col-span-4 grid grid-cols-2 h-full divide-x divide-zinc-700/20">
              <div className="w-full flex items-center justify-center hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-1.5 text-white group-hover:text-zinc-100 transition-colors">
                  <svg
                    className="w-[16px] h-[16px] md:w-[17px] md:h-[17px] lg:w-[18px] lg:h-[18px] xl:w-[19px] xl:h-[19px] group-hover:scale-105 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                  <span className="hidden lg:block text-xs xl:text-sm tracking-wider font-normal text-zinc-100">권한 관리</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-center hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-1.5 text-white group-hover:text-zinc-100 transition-colors">
                  <svg
                    className="w-[16px] h-[16px] md:w-[17px] md:h-[17px] lg:w-[18px] lg:h-[18px] xl:w-[19px] xl:h-[19px] group-hover:scale-105 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  </svg>
                  <span className="hidden lg:block text-xs xl:text-sm tracking-wider font-normal text-zinc-100">로그인</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/80 z-[999]" />
      )}
    </>
  )
}
