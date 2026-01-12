const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },

    author: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: true,
    },

    coverImage: {
      type: String, // Cloudinary URL
      required: true,
    },

    totalPages: {
      type: Number,
      required: true,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    shelvedCount: {
      type: Number,
      default: 0, // used for popularity
    },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
