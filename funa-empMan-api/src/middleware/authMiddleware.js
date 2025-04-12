const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Environment variables (should be in .env file)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key';

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    // Verify token
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      
      // Check if admin exists and is active
      const admin = await Admin.findById(decoded.id);
      if (!admin || admin.status !== 'active') {
        return res.status(403).json({ message: 'Admin account not found or inactive' });
      }
      
      // Attach admin info to request
      req.admin = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Middleware to check if admin has required role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Role ${req.admin.role} is not authorized to access this resource`
      });
    }
    
    next();
  };
};
