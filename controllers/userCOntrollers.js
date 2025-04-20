import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

// create jwt token and set cookie
const createToken = async (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
const generateOtp = () => {
  let result = '';
  const numbers = '0123456789';
  for (let i = 0; i < 6; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};
//register user controller
const register = async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name || !email || !password || !username) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  try {
    const emailAlreadyExist = await userModel.findOne({ email });
    if (emailAlreadyExist) {
      return res.status(404).json({
        success: false,
        message: 'Email already exist! Please Login.',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    //create token
    createToken(newUser._id, res);

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to our app',
      text: `We want to extend our warm greetings, ${name}. Welcome to our app. Your account has been created with email: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: 'Account have been created successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const checkUserName = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required.',
      });
    }
    const userNameAlreadyExist = await userModel.findOne({ username });

    if (userNameAlreadyExist) {
      return res.status(404).json({
        success: false,
        message: 'Username already taken. Please choose another.',
      });
    }
    res.status(200).json({ success: true, message: 'Username is available.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const login = async (req, res) => {
  const { password, identifier } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/username and password are required.',
    });
  }
  try {
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    createToken(user._id, res);

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const sendOtp = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (user.isEmailVerified)
      return res
        .status(400)
        .json({ success: false, message: 'Account already verified' });
    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpirationTime = Date.now() + 10 * 60 * 1000; //10 minutes in milliseconds

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Verify account',
      text: `Your OTP is ${otp}.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: `OTP sent.` });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.status(201).json({
      success: true,
      message: 'Logged out successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const verifyOtp = async (req, res) => {
  const { userId } = req.user;
  const { otp } = req.body;

  if (!userId || !otp)
    return res.status(400).json({ success: false, message: 'Missing otp.' });

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'User not found.' });
    if (user.verifyOtp !== otp || user.verifyOtp === '')
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect OTP.' });
    if (user.verifyOtpExpirationTime < Date.now())
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request for another.',
      });

    user.verifyOtpExpirationTime = 0;
    user.verifyOtp = '';
    user.isEmailVerified = true;

    await user.save();
    res.status(200).json({
      success: true,
      message: 'Email verified.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const isAuthenticated = async (req, res) => {
  try {
    res
      .status(200)
      .json({
        success: req.authStatus === 'authenticated',
        status: req.authStatus,
      });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const sendResetOtp = async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Email/username is required to proceed.',
    });
  }
  try {
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist.',
      });
    }

    const otp = generateOtp();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpirationTime = Date.now() + 10 * 60 * 1000; //10 minutes in milliseconds
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. Rest your password with this otp. `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: `OTP sent to email.` });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};

const verifyResetOtp = async (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  if (!identifier || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message:
        'Email/username, otp and new password required is required to proceed.',
    });
  }
  try {
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist.',
      });
    }
    if (user.resetPasswordOtp === '' || user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP.',
      });
    }
    if (user.resetPasswordOtpExpirationTime < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired.',
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 11);

    user.password = hashPassword;

    user.resetPasswordOtp = '';
    user.resetPasswordOtpExpirationTime = 0; //10 minutes in milliseconds
    await user.save();
    res.status(200).json({
      success: true,
      message: `Password has been reset successfully.`,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
const getUserData = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        username: user.username,
        verifiedAccount: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error!',
    });
  }
};
export {
  login,
  checkUserName,
  register,
  logout,
  sendOtp,
  verifyOtp,
  isAuthenticated,
  sendResetOtp,
  verifyResetOtp,
  getUserData,
};
