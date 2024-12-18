'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BookManager from '@/components/BookManager'
import { LibraryProvider } from '@/contexts/LibraryContext'

export default function BookManagerPage() {
  const searchParams = useSearchParams()
  const libraryId = searchParams.get('libraryId')

  return (
    <LibraryProvider>
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <BookManager standalone={true} libraryId={libraryId} />
        </div>
      </div>
    </LibraryProvider>
  )
} 
