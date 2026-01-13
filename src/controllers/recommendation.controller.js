import Shelf from '../models/shelf.model.js';
import Book from '../models/book.model.js';
import mongoose from 'mongoose';

export const getRecommendations = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const genreStats = await Shelf.aggregate([
    { $match: { user: userId, status: 'read' } },
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'book',
      },
    },
    { $unwind: '$book' },
    {
      $group: {
        _id: '$book.genre',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  // If user has not read enough books fallback
  if (genreStats.length < 1) {
    const fallback = await Book.find()
      .sort({ averageRating: -1, shelvedCount: -1 })
      .limit(12)
      .populate('genre');

    return res.json({
      type: 'fallback',
      books: fallback,
    });
  }

  const genreIds = genreStats.map((g) => g._id);

  // Recommend books from preferred genres
  const recommendedBooks = await Book.aggregate([
    {
      $match: {
        genre: { $in: genreIds },
      },
    },
    {
      $sort: {
        averageRating: -1,
        shelvedCount: -1,
      },
    },
    { $limit: 18 },
  ]);

  res.json({
    type: 'personalized',
    genres: genreStats,
    books: recommendedBooks,
  });
};
