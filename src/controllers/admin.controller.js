import User from '../models/user.model.js';
import Book from '../models/book.model.js';
import Review from '../models/review.model.js';

export const getAdminStats = async (req, res) => {
  const [users, books, pendingReviews, booksPerGenre] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Review.countDocuments({ status: 'pending' }),
    Book.aggregate([
      {
        $lookup: {
          from: 'genres',
          localField: 'genre',
          foreignField: '_id',
          as: 'genre',
        },
      },
      { $unwind: '$genre' },
      {
        $group: {
          _id: '$genre.name',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.json({
    users,
    books,
    pendingReviews,
    booksPerGenre,
  });
};
