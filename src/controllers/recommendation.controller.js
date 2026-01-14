import Shelf from '../models/shelf.model.js';
import Book from '../models/book.model.js';
import mongoose from 'mongoose';

export const getRecommendations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Get user's reading history
    const readBooks = await Shelf.find({ user: userId, status: 'read' }).populate('book').limit(50);

    if (readBooks.length < 3) {
      // Fallback to popular books
      const fallback = await Book.find()
        .sort({ averageRating: -1, addedToShelvesCount: -1 })
        .limit(12)
        .lean();
      return res.json({
        type: 'fallback',
        books: fallback,
      });
    }

    // Analyze genres
    const genreCounts = readBooks.reduce((acc, { book }) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // Get recommendations
    const recommendations = await Book.aggregate([
      {
        $match: {
          genre: { $in: topGenres },
          _id: { $nin: readBooks.map((b) => b.book._id) },
        },
      },
      {
        $addFields: {
          genreMatch: { $indexOfArray: [topGenres, '$genre'] },
        },
      },
      {
        $sort: {
          genreMatch: 1,
          averageRating: -1,
          addedToShelvesCount: -1,
        },
      },
      { $limit: 12 },
    ]);

    // If not enough recommendations, fill with popular books
    if (recommendations.length < 12) {
      const additionalBooks = await Book.find({
        _id: { $nin: [...readBooks.map((b) => b.book._id), ...recommendations.map((b) => b._id)] },
      })
        .sort({ averageRating: -1, addedToShelvesCount: -1 })
        .limit(12 - recommendations.length)
        .lean();

      recommendations.push(...additionalBooks);
    }

    res.json({
      type: 'personalized',
      genres: topGenres,
      books: recommendations.slice(0, 12),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
