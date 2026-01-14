import Book from '../models/book.model.js';
import Review from '../models/review.model.js';

const handleError = (res, error, status = 400) => {
  console.error(error);
  res.status(status).json({
    success: false,
    message: error.message || 'An error occurred',
  });
};

// Validation constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 12;
const SORT_OPTIONS = {
  rating: '-averageRating',
  shelved: '-addedToShelvesCount',
  newest: '-createdAt',
  oldest: 'createdAt',
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  await Review.deleteMany({ book: req.params.id });
  res.json({ message: 'Book deleted' });
};

export const getAllBooks = async (req, res) => {
  try {
    let { search, genres, rating, sort = 'rating', page = 1, limit = DEFAULT_LIMIT } = req.query;

    // Validate and parse numeric inputs
    page = Math.max(1, parseInt(page)) || 1;
    limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit))) || DEFAULT_LIMIT;
    rating = parseFloat(rating) || 0;

    // Validate sort parameter
    const sortValue = SORT_OPTIONS[sort] || SORT_OPTIONS.rating;

    const query = {};

    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { author: searchRegex }, { description: searchRegex }];
    }

    if (genres) {
      const genreArray = genres
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g);
      if (genreArray.length > 0) {
        query.genre = { $in: genreArray };
      }
    }

    if (rating > 0) {
      query.averageRating = { $gte: rating };
    }

    const [books, totalCount] = await Promise.all([
      Book.find(query)
        .sort(sortValue)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Book.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      },
    });
  } catch (err) {
    handleError(res, err, 500);
  }
};

export const getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('genre');
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    const reviews = await Review.find({
      book: req.params.id,
      status: 'approved',
    }).populate('user', 'name photo');

    res.json({
      success: true,
      data: {
        book,
        reviews,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};
