import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Book from '@/models/Book'

export async function GET(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const libraryId = searchParams.get('libraryId')
    const query = searchParams.get('query')

    let filter = {}
    if (libraryId) {
      filter.libraryId = libraryId
    }
    if (query) {
      filter.title = { $regex: query, $options: 'i' }
    }

    const books = await Book.find(filter)
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
