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
  location: {
    type: String,
    required: true
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  }
})

export default mongoose.models.Book || mongoose.model('Book', bookSchema) 
