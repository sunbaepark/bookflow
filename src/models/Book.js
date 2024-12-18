import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['대출가능', '대출중'],
    default: '대출가능'
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  bookshelfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookshelf',
    required: true
  }
}, {
  timestamps: true
})

// 기존 모델이 있다면 삭제
if (mongoose.models.Book) {
  delete mongoose.models.Book
}

export default mongoose.model('Book', bookSchema) 
