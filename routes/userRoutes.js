import express from 'express';
import {
  checkUserName,
  getUserData,
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
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
userRouter.post('/otp/reset-password/send', sendResetOtp);
userRouter.post('/otp/reset-password/verify', verifyResetOtp);
userRouter.post('/reset/password', resetPassword);

export default userRouter;
