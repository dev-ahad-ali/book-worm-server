import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// routes import
import { ProductRouter } from './routes/product.routes.js';

//routes declaration
app.use('/product', ProductRouter);

export { app };
