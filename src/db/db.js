import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.rocppxe.mongodb.net/${DB_NAME}`
    );
    console.log('Database connection instance host', connectionInstance.connection.host);
  } catch (error) {
    console.log('DB connection error', error);
    process.exit(1);
  }
};
