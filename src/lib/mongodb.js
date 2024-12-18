import mongoose from 'mongoose'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI가 설정되지 않았습니다.')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  try {
    if (cached.conn) {
      console.log('기존 MongoDB 연결 사용')
      return cached.conn
    }

    console.log('새로운 MongoDB 연결 시도...')
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
    cached.conn = await cached.promise
    console.log('MongoDB 연결 성공')

    return cached.conn
  } catch (e) {
    console.error('MongoDB 연결 에러:', e)
    cached.promise = null
    throw e
  }
}

export default dbConnect 
