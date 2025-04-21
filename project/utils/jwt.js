import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || 3600; // 1 hour in seconds
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || 604800; // 1 week in seconds

export const generateAccessToken = (userId, username, role) => {
  return jwt.sign(
    { id: userId, username, role },
    JWT_SECRET,
    { expiresIn: parseInt(JWT_EXPIRATION) }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: parseInt(REFRESH_TOKEN_EXPIRATION) }
  );
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null
    };
  }
};