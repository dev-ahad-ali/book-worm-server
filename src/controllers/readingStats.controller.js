import Shelf from '../models/shelf.model.js';
import ReadingGoal from '../models/readingGoal.model.js';
import mongoose from 'mongoose';

export const getReadingStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const year = new Date().getFullYear();

    const booksRead = await Shelf.find({
      user: userId,
      status: 'read',
      finishedAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    }).populate('book');

    const totalPages = booksRead.reduce((sum, item) => sum + (item.book?.totalPages || 0), 0);

    const monthly = await Shelf.aggregate([
      {
        $match: {
          user: userId,
          status: 'read',
          finishedAt: {
            $gte: new Date(`${year}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$finishedAt' },
          count: { $sum: 1 },
        },
      },
    ]);

    const genres = await Shelf.aggregate([
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
        $lookup: {
          from: 'genres',
          localField: 'book.genre',
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
    ]);

    const goal = await ReadingGoal.findOne({
      user: userId,
      year,
    });

    res.json({
      booksRead: booksRead.length,
      totalPages,
      monthly,
      genres,
      goal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReadingGoal = async (req, res) => {
  try {
    const { annualGoal } = req.body;
    const userId = req.user._id;
    const year = new Date().getFullYear();

    const goal = await ReadingGoal.findOneAndUpdate(
      { user: userId, year },
      { annualGoal },
      { upsert: true, new: true }
    );

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
