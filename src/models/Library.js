import mongoose from 'mongoose'

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '도서관 이름은 필수입니다'],
    trim: true
  },
  image: {
    type: String,
    required: [true, '도서관 이미지는 필수입니다'],
    default: "/default-library.png"
  }
}, {
  timestamps: true
})

export default mongoose.models.Library || mongoose.model('Library', librarySchema) 
