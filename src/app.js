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

//routes declaration
app.use('/api/auth', authRoutes);

export { app };
