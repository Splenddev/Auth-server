import express from 'express';
import {
  checkUserName,
  getUserData,
  isAuthenticated,
  login,
  logout,
  register,
  sendOtp,
  sendResetOtp,
  verifyOtp,
  verifyResetOtp,
} from '../controllers/userCOntrollers.js';
import userAuthMiddleware from '../middleware/userAuthMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.get('/is-auth', userAuthMiddleware, isAuthenticated);
userRouter.post('/login', login);
userRouter.get('/get/data', userAuthMiddleware, getUserData);
userRouter.post('/logout', logout);
userRouter.post('/check/username', checkUserName);
userRouter.post('/otp/send', userAuthMiddleware, sendOtp);
userRouter.post('/otp/verify', userAuthMiddleware, verifyOtp);
userRouter.post('/otp/reset-password/send', userAuthMiddleware, sendResetOtp);
userRouter.post('/reset/password', userAuthMiddleware, verifyResetOtp);

export default userRouter;
