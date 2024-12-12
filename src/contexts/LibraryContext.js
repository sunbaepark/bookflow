'use client'

import { createContext, useContext, useState } from 'react'

const LibraryContext = createContext()

export function LibraryProvider({ children }) {
  const [selectedLibrary, setSelectedLibrary] = useState(null)

  return (
    <LibraryContext.Provider value={{ selectedLibrary, setSelectedLibrary }}>
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
