import express from 'express';
import { getProfile, updateProfile, updateUserRole } from '../controllers/user.controller.js';
import { authenticateToken, isAdmin, isModeratorOrAdmin } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.use(apiLimiter);

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'This is a protected endpoint. Only authenticated users can access it.',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

router.get('/moderator', authenticateToken, isModeratorOrAdmin, (req, res) => {
  res.status(200).json({
    message: 'This is a moderator endpoint. Only moderators and admins can access it.',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.status(200).json({
    message: 'This is an admin endpoint. Only admins can access it.',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// User profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// User management routes (admin only)
router.put('/users/:id/role', authenticateToken, isAdmin, updateUserRole);

export default router;