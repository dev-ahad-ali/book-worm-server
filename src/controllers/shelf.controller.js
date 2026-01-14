import Shelf from '../models/shelf.model.js';
import Book from '../models/book.model.js';

export const addToShelf = async (req, res) => {
  try {
    const { book, status, progress } = req.body;

    const shelf = await Shelf.findOneAndUpdate(
      { user: req.user._id, book },
      { status, progress },
      { upsert: true, new: true }
    );

    await Book.findByIdAndUpdate(book, { $inc: { addedToShelvesCount: 1 } });

    res.json(shelf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyLibrary = async (req, res) => {
  try {
    const shelves = await Shelf.find({ user: req.user._id }).populate('book');
    res.json(shelves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateShelf = async (req, res) => {
  try {
    const { shelfType } = req.body;
    const shelf = await Shelf.findOneAndUpdate(
      { user: req.user._id, book: req.params.bookId },
      { status: shelfType },
      { new: true }
    );

    res.json(shelf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeFromShelf = async (req, res) => {
  try {
    await Shelf.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });

    res.json({ message: 'Removed from library' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
