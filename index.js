import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import userRouter from './routes/userRoutes.js';

//configs
const app = express();
const port = process.env.PORT || 5000;
connectDB();

const allowedUrls = [
  'http://localhost:5173',
  'https://user-auth-a9pf.onrender.com',
];

//app middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedUrls, credentials: true }));

//app routes
app.use('/app/user', userRouter);
app.listen(port, () =>
  console.log(`Server running on: http://localhost:${port}`)
);
