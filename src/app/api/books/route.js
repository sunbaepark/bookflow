import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Book from '@/models/Book'
import mongoose from 'mongoose'

export async function POST(request) {
  try {
    await dbConnect()
    const data = await request.json()
    const { title, status, libraryId } = data

    const validationErrors = []

    if (!title?.trim()) {
      validationErrors.push('도서 제목은 필수입니다')
    }

    if (!libraryId) {
      validationErrors.push('도서관 ID는 필수입니다')
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      )
    }

    const book = await Book.create({
      title: title.trim(),
      status: status || "대출가능",
      libraryId: new mongoose.Types.ObjectId(libraryId)
    })

    return NextResponse.json({ success: true, book })

  } catch (error) {
    return NextResponse.json(
      { error: "도서 추가에 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const libraryId = searchParams.get('libraryId')
    const ids = searchParams.get('ids')?.split(',')

    if (!libraryId) {
      return NextResponse.json(
        { error: "도서관 ID가 필요합니다" },
        { status: 400 }
      )
    }

    let query = { libraryId: new mongoose.Types.ObjectId(libraryId) }

    // ids 파라미터가 있는 경우에만 해당 도서들을 필터링
    if (ids) {
      query._id = { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
    }

    const books = await Book.find(query)
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: "도서 목록을 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 도서 ID입니다" },
        { status: 400 }
      );
    }

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "도서를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('도서 삭제 실패:', error);
    return NextResponse.json(
      { error: "도서 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
