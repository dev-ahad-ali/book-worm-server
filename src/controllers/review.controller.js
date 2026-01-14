import Review from '../models/review.model.js';
import Book from '../models/book.model.js';

export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user._id,
      status: 'pending',
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
      status: 'approved',
    }).populate('user', 'name photo');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPendingReviews = async (req, res) => {
  const reviews = await Review.find({ status: 'pending' })
    .populate('user', 'name')
    .populate('book', 'title');
  res.json(reviews);
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'approved';
    await review.save();

    // Update book rating
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

    if (stats.length > 0) {
      await Book.findByIdAndUpdate(review.book, {
        averageRating: stats[0].avg,
        reviewCount: stats[0].count,
      });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
};
