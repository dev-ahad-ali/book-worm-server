import Book from '../models/book.model.js';
import Review from '../models/review.model.js';

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
  const { search, genres, rating, sort = 'createdAt', page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) {
    query.$or = [{ title: new RegExp(search, 'i') }, { author: new RegExp(search, 'i') }];
  }

  if (genres) {
    query.genre = { $in: genres.split(',') };
  }

  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }

  const books = await Book.find(query)
    .populate('genre')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(books);
};

export const getBookDetails = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('genre');

  const reviews = await Review.find({
    book: req.params.id,
    status: 'approved',
  }).populate('user', 'name photo');

  res.json({ book, reviews });
};
