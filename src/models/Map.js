import mongoose from 'mongoose'

const mapSchema = new mongoose.Schema({
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true,
    unique: true
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  markers: {
    start: {
      x: { type: Number, default: null },
      y: { type: Number, default: null }
    },
    end: {
      x: { type: Number, default: null },
      y: { type: Number, default: null }
    }
  },
  shelves: [{
    bookshelfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookshelf',
      required: true
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }]
}, {
  timestamps: true
})

export default mongoose.models.Map || mongoose.model('Map', mapSchema) 