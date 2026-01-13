import Review from '../models/review.model.js';
import Book from '../models/book.model.js';

export const createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    user: req.user._id,
    status: 'pending',
  });

  res.status(201).json(review);
};

export const getPendingReviews = async (req, res) => {
  const reviews = await Review.find({ status: 'pending' })
    .populate('user', 'name')
    .populate('book', 'title');
  res.json(reviews);
};

export const approveReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  review.status = 'approved';
  await review.save();

  // update book rating
  const stats = await Review.aggregate([
    { $match: { book: review.book, status: 'approved' } },
    {
      $group: {
        _id: '$book',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  await Book.findByIdAndUpdate(review.book, {
    averageRating: stats[0].avg,
    ratingsCount: stats[0].count,
  });

  res.json({ message: 'Review approved' });
};

export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
};
