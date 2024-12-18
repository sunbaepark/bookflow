import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Map from '@/models/Map'
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

    const map = await Map.findOne({ libraryId })
      .populate('shelves.bookshelfId')
      .lean()

    return NextResponse.json(map)
  } catch (error) {
    console.error('맵 조회 실패:', error)
    return NextResponse.json(
      { error: '맵 데이터를 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    await dbConnect()
    const { libraryId, mapData } = await request.json()
    
    console.log('=== Map Update Request ===')
    console.log('libraryId:', libraryId)

    const bookshelves = await Bookshelf.find({ libraryId })
    
    const updatedShelves = mapData.shelves.map(shelf => {
      const bookshelf = bookshelves.find(b => b._id.toString() === shelf.id)
      if (!bookshelf) {
        throw new Error(`Bookshelf not found: ${shelf.id}`)
      }
      return {
        bookshelfId: bookshelf._id,
        x: shelf.x,
        y: shelf.y
      }
    })

    const updatedMapData = {
      ...mapData,
      shelves: updatedShelves
    }

    console.log('Updated map data:', JSON.stringify(updatedMapData, null, 2))

    const map = await Map.findOneAndUpdate(
      { libraryId },
      { 
        $set: updatedMapData,
        libraryId
      },
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    )
    .populate('shelves.bookshelfId')
    .lean()

    console.log('=== Updated Map ===')
    console.log(JSON.stringify(map, null, 2))

    return NextResponse.json(map)
  } catch (error) {
    console.error('맵 업데이트 실패:', error)
    return NextResponse.json(
      { error: '맵 데이터 저장에 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const { libraryId, markers, dimensions, shelves } = await request.json()
    
    console.log('=== Map Create Request ===')
    console.log('Request Data:', { libraryId, markers, dimensions, shelves })

    const mapData = {
      libraryId,
      markers: {
        start: markers?.start || null,
        end: markers?.end || null
      },
      dimensions: dimensions || { width: 800, height: 600 },
      shelves: [],
      walls: []
    }

    const map = await Map.findOneAndUpdate(
      { libraryId },
      mapData,
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    )
    .populate('shelves.bookshelfId')
    .lean()

    console.log('=== Created Map ===')
    console.log(JSON.stringify(map, null, 2))

    return NextResponse.json(map)
  } catch (error) {
    console.error('맵 생성 실패:', error)
    return NextResponse.json(
      { error: '맵 데이터 저장에 실패했습니다' },
      { status: 500 }
    )
  }
}