import mongoose from 'mongoose'

const bookshelfSchema = new mongoose.Schema({
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: '미지정'
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
}, {
  timestamps: true
})

export default mongoose.models.Bookshelf || mongoose.model('Bookshelf', bookshelfSchema) 
