import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb://localhost:27017/bookflow'

if (!MONGODB_URI) {
  throw new Error('MongoDB URI가 정의되지 않았습니다.')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect 
