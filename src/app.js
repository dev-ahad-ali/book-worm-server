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

//routes declaration
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shelves', shelfRoutes);

export { app };
