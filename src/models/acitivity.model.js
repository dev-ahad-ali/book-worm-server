const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['SHELF_ADD', 'REVIEW', 'FINISH_BOOK'],
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },

    message: String,
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
