import mongoose from 'mongoose'

const bookshelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  }
})

export default mongoose.models.Bookshelf || mongoose.model('Bookshelf', bookshelfSchema) 
