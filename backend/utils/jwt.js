import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const sendTokenResponse = (user, statusCode,res) => {
    const token = generateToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user: user.toPublicProfile(),
    });
};