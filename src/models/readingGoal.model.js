const readingGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    targetBooks: {
      type: Number,
      required: true,
    },

    booksRead: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ReadingGoal', readingGoalSchema);
