'use client'

import { useState } from 'react'
import Title from '@/components/title'
import BookSearch from '@/components/BookSearch'
import NavigationBar from '@/components/NavigationBar'
import Cart from '@/components/Cart'
import { LibraryProvider } from '@/contexts/LibraryContext'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <LibraryProvider>
      <NavigationBar setIsPopupOpen={setIsPopupOpen} />
      <main className="min-h-screen pt-16 relative">
        <div className="sticky top-16 bg-white z-40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Title />
              <div className="mt-8">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="도서명을 입력하세요"
                  className="w-full px-0 py-2 bg-transparent border-b border-zinc-900 focus:border-black focus:outline-none transition-colors text-lg text-center placeholder:text-zinc-400 placeholder:transition-opacity focus:placeholder:opacity-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <BookSearch searchQuery={searchTerm} setSearchQuery={setSearchTerm} />
          </div>
        </div>
      </main>
      <Cart />

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100]" />
      )}
    </LibraryProvider>
  )
}
