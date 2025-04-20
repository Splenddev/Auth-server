import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpirationTime: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordOtp: { type: String, default: '' },
  resetPasswordOtpExpirationTime: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
