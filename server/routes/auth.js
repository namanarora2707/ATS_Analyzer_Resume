import { createAuthResponse } from '../shared/api.js';

// In-memory user storage (replace with database in production)
const users = [];
let nextUserId = 1;

// Simple JWT-like token generation (replace with proper JWT in production)
const generateToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

export const handleLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const response = createAuthResponse(false, null, null, "Username and password are required");
      return res.status(400).json(response);
    }

    // Find user by username (in production, hash and compare passwords)
    const user = users.find(u => u.username === username);
    
    if (!user) {
      const response = createAuthResponse(false, null, null, "Invalid username or password");
      return res.status(401).json(response);
    }

    // In production, verify password hash here
    // For demo purposes, we'll accept any password for existing users
    
    const token = generateToken(user.id);
    
    const response = createAuthResponse(true, user, token);
    
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response = createAuthResponse(false, null, null, "Internal server error");
    res.status(500).json(response);
  }
};

export const handleSignup = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const response = createAuthResponse(false, null, null, "Username and password are required");
      return res.status(400).json(response);
    }

    if (password.length < 6) {
      const response = createAuthResponse(false, null, null, "Password must be at least 6 characters long");
      return res.status(400).json(response);
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      const response = createAuthResponse(false, null, null, "User with this username already exists");
      return res.status(409).json(response);
    }

    // Create new user
    const newUser = {
      id: nextUserId.toString(),
      username,
      createdAt: new Date().toISOString()
    };
    
    nextUserId++;
    users.push(newUser);

    const token = generateToken(newUser.id);
    
    const response = createAuthResponse(true, newUser, token);
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Signup error:', error);
    const response = createAuthResponse(false, null, null, "Internal server error");
    res.status(500).json(response);
  }
};

// Middleware to verify authentication
export const verifyAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.substring(7);
    
    // In production, verify JWT token properly
    // For demo purposes, we'll accept any token that follows our format
    if (!token.startsWith('token_')) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // Extract user ID from token (in production, decode JWT)
    const tokenParts = token.split('_');
    const userId = tokenParts[1];
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
