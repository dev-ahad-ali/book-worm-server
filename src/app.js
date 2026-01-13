import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes import
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import genreRoutes from './routes/genre.routes.js';
import reviewRoutes from './routes/review.routes.js';
import shelfRoutes from './routes/shelf.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import readingStatsRoutes from './routes/readingStats.routes.js';
import activityRoutes from './routes/activity.routes.js';
import tutorialRoutes from './routes/tutorial.routes.js';

//routes declaration
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shelves', shelfRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reading-stats', readingStatsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tutorials', tutorialRoutes);

export { app };
