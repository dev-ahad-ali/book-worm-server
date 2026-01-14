import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },

    status: {
      type: String,
      enum: ['want-to-read', 'currently-reading', 'read'],
      required: true,
    },

    progress: {
      pagesRead: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },

    finishedAt: Date,
  },
  { timestamps: true }
);

// Prevent same book twice in shelf
shelfSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('Shelf', shelfSchema);
