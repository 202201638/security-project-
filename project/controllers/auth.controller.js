import bcrypt from 'bcryptjs';
import { findUserByUsername, findUserByEmail, createUser, saveRefreshToken, findRefreshToken, removeRefreshToken } from '../models/db.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { validateRegistration, validateLogin } from '../utils/validation.js';

// User registration
export const register = async (req, res) => {
  try {
    // Validate user input
    const { isValid, errors } = validateRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const { username, email, password } = req.body;
    
    // Check if username or email already exists
    if (findUserByUsername(username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    if (findUserByEmail(email)) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with default 'user' role if not specified
    const role = req.body.role || 'user';
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    });
    
    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// User login
export const login = async (req, res) => {
  try {
    // Validate login input
    const { isValid, errors } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    const { username, password } = req.body;
    
    // Find user by username
    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    const refreshToken = generateRefreshToken(user.id);
    
    // Save refresh token
    await saveRefreshToken(refreshToken, user.id);
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    // Verify refresh token
    const { valid, expired, decoded } = verifyToken(token);
    
    if (!valid) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    if (expired) {
      // Remove expired token
      await removeRefreshToken(token);
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    
    // Check if token exists in database
    const tokenRecord = findRefreshToken(token);
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    
    // Find user
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user.id, user.username, user.role);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken
    });
  } catch (error) {
    console.error('Error in refreshToken controller:', error);
    res.status(500).json({ message: 'Token refresh failed' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    // Remove refresh token from database
    await removeRefreshToken(token);
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};