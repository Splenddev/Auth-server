import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database connected'));
  await mongoose.connect(`${process.env.MONGODB_URL}/auth-system`);
};
