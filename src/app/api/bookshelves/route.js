import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Bookshelf from '@/models/Bookshelf'

export async function GET(request) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const libraryId = searchParams.get('libraryId')
    
    if (!libraryId) {
      return NextResponse.json(
        { error: 'libraryId is required' },
        { status: 400 }
      )
    }

    const bookshelves = await Bookshelf.find({ libraryId })
    
    return NextResponse.json(bookshelves)
  } catch (error) {
    console.error('책장 조회 실패:', error)
    return NextResponse.json(
      { error: '책장 목록을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    const data = await request.json()
    const { id, name } = data

    if (!id) {
      return NextResponse.json(
        { error: '책장 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const updatedBookshelf = await Bookshelf.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    )

    if (!updatedBookshelf) {
      return NextResponse.json(
        { error: '책장을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedBookshelf)
  } catch (error) {
    console.error('책장 수정 실패:', error)
    return NextResponse.json(
      { error: '책장 정보 수정에 실패했습니다' },
      { status: 500 }
    )
  }
} 