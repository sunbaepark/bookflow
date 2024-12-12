"use client"
import { useState, useMemo } from "react"
import { useLibrary } from "../contexts/LibraryContext"

function BookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const { books } = useLibrary();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return books;
    }

    return books.filter(book =>
      book.title.includes(searchQuery)
    );
  }, [searchQuery, books])

  const handleSearch = (e) => {
    e.preventDefault();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="도서명 검색"
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
      <div className="space-y-4">
        {searchResults.map((book) => (
          <div
            key={book._id}
            className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">{book.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookSearch
