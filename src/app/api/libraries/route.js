import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Library from '@/models/Library'

export async function GET() {
  try {
    await dbConnect()
    const libraries = await Library.find({})
    return NextResponse.json(libraries)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 
