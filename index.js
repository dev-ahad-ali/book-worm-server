import dotenv from 'dotenv';
import { connectDB } from './src/db/db.js';
import { app } from './src/app.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.log('Server Initialize error', error);
      throw error;
    });
    app.get('/', (req, res) => res.send('FootyRoom on Vercel'));
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on Port : ${process.env.Port || 5000}`);
    });
  })
  .catch((error) => {
    console.log('Db connection error', error);
  });
