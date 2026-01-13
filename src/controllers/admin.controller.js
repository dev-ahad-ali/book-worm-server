import User from '../models/user.model.js';
import Book from '../models/book.model.js';
import Review from '../models/review.model.js';
import Genre from '../models/genre.model.js';

export const getAdminStats = async (req, res) => {
  try {
    const [
      usersCount,
      booksCount,
      pendingReviewsCount,
      approvedReviewsCount,
      genresCount,
      booksPerGenre,
      recentBooks,
      pendingReviews,
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Genre.countDocuments(),
      Book.aggregate([
        { $lookup: { from: 'genres', localField: 'genre', foreignField: '_id', as: 'genre' } },
        { $unwind: '$genre' },
        { $group: { _id: '$genre.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Book.find().sort({ createdAt: -1 }).limit(5).lean(),
      Review.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('book', 'title')
        .lean(),
    ]);

    res.json({
      users: usersCount,
      books: booksCount,
      pendingReviews: pendingReviewsCount,
      approvedReviews: approvedReviewsCount,
      genres: genresCount,
      booksPerGenre,
      recentBooks,
      pendingReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
