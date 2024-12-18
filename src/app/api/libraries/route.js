import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Library from '@/models/Library'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await dbConnect()
    const libraries = await Library.find({})
    return NextResponse.json(libraries)
  } catch (error) {
    console.error('도서관 목록 조회 실패:', error)
    return NextResponse.json(
      { error: "도서관 목록을 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const data = await request.json()
    const { name, image } = data

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "도서관 이름은 필수입니다" },
        { status: 400 }
      )
    }

    const library = await Library.create({
      name: name.trim(),
      image: image || "/default-library.png"  // 기본 이미지 경로 설정
    })

    return NextResponse.json(library)
  } catch (error) {
    console.error('도서관 생성 실패:', error)
    return NextResponse.json(
      { error: "도서관 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    const { libraryId, mapData } = await request.json()
    
    console.log('=== Map Update Request ===');
    console.log('libraryId:', libraryId);
    console.log('mapData:', JSON.stringify(mapData, null, 2));

    // 업데이트 전 도서관 데이터 확인
    const beforeUpdate = await Library.findById(libraryId);
    console.log('Before update:', JSON.stringify(beforeUpdate, null, 2));

    // 명시적으로 map 필드 업데이트
    const updatedLibrary = await Library.findByIdAndUpdate(
      libraryId,
      { map: mapData },  // 간단하게 변경
      { 
        new: true,
        runValidators: true,
        select: '+map' // map 필드가 명시적으로 포함되도록
      }
    ).lean() // JavaScript 객체로 변환

    console.log('=== Update Result ===');
    console.log('Updated library:', JSON.stringify(updatedLibrary, null, 2));

    if (!updatedLibrary) {
      console.log('Library not found with id:', libraryId);
      return NextResponse.json(
        { error: '도서관을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 업데이트 후 다시 한번 확인
    const finalCheck = await Library.findById(libraryId).lean();
    console.log('Final check:', JSON.stringify(finalCheck, null, 2));

    return NextResponse.json(updatedLibrary)
  } catch (error) {
    console.error('=== Map Update Error ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: '맵 데이터 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
