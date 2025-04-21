import bcrypt from 'bcryptjs';
import { findUserById, updateUser } from '../models/db.js';
import { validateProfileUpdate, validateRoleUpdate } from '../utils/validation.js';

// Get user profile
export const getProfile = (req, res) => {
  try {
    // Get user from authenticated request
    const userId = req.user.id;
    const user = findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userProfile } = user;
    
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Error in getProfile controller:', error);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Validate update data
    const { isValid, errors } = validateProfileUpdate(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    // Prepare update data
    const updateData = {};
    
    // Update email if provided
    if (req.body.email) {
      updateData.email = req.body.email;
    }
    
    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    // Update user
    const updatedUser = await updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return updated user without password
    const { password, ...userProfile } = updatedUser;
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Error in updateProfile controller:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate role
    const validation = validateRoleUpdate(role);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Find user
    const user = findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update role
    const updatedUser = await updateUser(id, { role });
    
    // Return updated user without password
    const { password, ...userProfile } = updatedUser;
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Error in updateUserRole controller:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};