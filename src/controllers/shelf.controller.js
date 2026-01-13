import Shelf from '../models/shelf.model.js';
import Book from '../models/book.model.js';

export const addToShelf = async (req, res) => {
  const { book, status, progress } = req.body;

  const shelf = await Shelf.findOneAndUpdate(
    { user: req.user._id, book },
    { status, progress },
    { upsert: true, new: true }
  );

  await Book.findByIdAndUpdate(book, { $inc: { shelvedCount: 1 } });

  res.json(shelf);
};

export const getMyLibrary = async (req, res) => {
  const shelves = await Shelf.find({ user: req.user._id }).populate('book');
  res.json(shelves);
};
