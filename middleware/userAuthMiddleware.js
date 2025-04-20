import jwt from 'jsonwebtoken';

const userAuthMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  console.log('token', token);

  if (!token) {
    req.user = null;
    req.authStatus = 'guest';
    return next();
  }
  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { userId: decodeToken.id };
    req.authStatus = 'authenticated';
    return next();
  } catch (error) {
    req.user = null;
    req.authStatus = 'expired';
    return next();
  }
};
export default userAuthMiddleware;
