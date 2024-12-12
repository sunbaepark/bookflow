import mongoose from 'mongoose'

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

export default mongoose.models.Library || mongoose.model('Library', librarySchema) 