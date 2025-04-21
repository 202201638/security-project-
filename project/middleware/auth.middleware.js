import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { valid, expired, decoded } = verifyToken(token);
  
  if (expired) {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  if (!valid) {
    return res.status(403).json({ message: 'Invalid token' });
  }
  
  req.user = decoded;
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const isModeratorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Moderator or admin access required' });
  }
};