import Shelf from '../models/shelf.model.js';
import ReadingGoal from '../models/readingGoal.model.js';
import mongoose from 'mongoose';

export const getReadingStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const year = new Date().getFullYear();

    // Books read this year
    const booksRead = await Shelf.find({
      user: userId,
      status: 'read',
      finishedAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    }).populate('book');

    // Monthly progress
    const monthlyProgress = await Shelf.aggregate([
      {
        $match: {
          user: userId,
          status: 'read',
          finishedAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$finishedAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Weekly pages
    const weeklyPages = await Shelf.aggregate([
      {
        $match: {
          user: userId,
          status: 'read',
          finishedAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $week: '$finishedAt' },
          pages: { $sum: '$book.totalPages' },
        },
      },
      {
        $project: {
          week: { $toString: '$_id' },
          pages: 1,
          _id: 0,
        },
      },
    ]);

    // Genre distribution
    const genreDistribution = await Shelf.aggregate([
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
        $group: {
          _id: '$book.genre',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0,
        },
      },
    ]);

    // Get or create reading goal
    let goal = await ReadingGoal.findOne({ user: userId, year });
    if (!goal) {
      goal = await ReadingGoal.create({
        user: userId,
        year,
        annualGoal: 12,
        booksReadThisYear: booksRead.length,
        totalPagesRead: booksRead.reduce((sum, item) => sum + (item.book?.totalPages || 0), 0),
        monthlyProgress,
        weeklyPages,
        genreDistribution,
      });
    } else {
      goal.booksReadThisYear = booksRead.length;
      goal.totalPagesRead = booksRead.reduce((sum, item) => sum + (item.book?.totalPages || 0), 0);
      goal.monthlyProgress = monthlyProgress;
      goal.weeklyPages = weeklyPages;
      goal.genreDistribution = genreDistribution;
      await goal.save();
    }

    res.json(goal);
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
