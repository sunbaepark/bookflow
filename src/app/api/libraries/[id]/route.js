import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Library from '@/models/Library'
import Map from '@/models/Map'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const library = await Library.findById(params.id).lean()
    if (!library) {
      return NextResponse.json(
        { error: '도서관을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 맵 데이터 조회
    const map = await Map.findOne({ libraryId: library._id })
      .populate('shelves.bookshelfId')
      .lean()

    return NextResponse.json({
      ...library,
      map: map || null
    })
  } catch (error) {
    console.error('도서관 조회 실패:', error)
    return NextResponse.json(
      { error: '도서관 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const data = await request.json()
    
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: '유효하지 않은 도서관 ID입니다.' },
        { status: 400 }
      )
    }

    const updatedLibrary = await Library.findByIdAndUpdate(
      params.id,
      { map: data.map },
      { 
        new: true,
        runValidators: true 
      }
    ).lean()

    if (!updatedLibrary) {
      return NextResponse.json(
        { error: '도서관을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedLibrary)
  } catch (error) {
    console.error('도서관 업데이트 실패:', error)
    return NextResponse.json(
      { error: '도서관 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
} 