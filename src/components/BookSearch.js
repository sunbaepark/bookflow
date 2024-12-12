"use client"
import { useState, useMemo } from "react"

export default function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  // 임시 데이터 (나중에 API로 대체)
  const books = [
    { _id: '1', title: '해리포터와 마법사의 돌', status: '대출가능', location: 'A-1-1' },
    { _id: '2', title: '반지의 제왕', status: '대출중', location: 'B-2-3' },
    { _id: '3', title: '어린왕자', status: '대출가능', location: 'C-1-2' }
  ]

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return books
    }

    return books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="도서명 검색"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 font-[NoonnuBasicGothic]"
        />
      </form>

      <div className="space-y-4">
        {searchResults.map((book) => (
          <div
            key={book._id}
            className="flex justify-between items-center p-4 border rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
          >
            <div>
              <h3 className="font-medium text-zinc-800">{book.title}</h3>
              <div className="flex gap-3 mt-1 text-sm">
                <span className={`${book.status === "대출가능" ? "text-green-600" : "text-red-600"
                  }`}>
                  {book.status}
                </span>
                <span className="text-zinc-500">위치: {book.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
