const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Environment variables (should be in .env file)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key';

// Middleware to verify JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    console.log('Authenticating token...');

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');

    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      console.log('Token verified, decoded:', decoded);

      // Check if admin exists and is active
      try {
        const admin = await Admin.findById(decoded.id);
        console.log('Admin found:', admin ? 'Yes' : 'No');

        if (!admin) {
          return res.status(403).json({ message: 'Admin account not found' });
        }

        if (admin.status !== 'active') {
          return res.status(403).json({ message: 'Admin account is inactive' });
        }

        // Attach admin info to request
        req.admin = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role
        };

        console.log('Authentication successful');
        next();
      } catch (adminError) {
        console.error('Error finding admin:', adminError);
        return res.status(500).json({ message: 'Error finding admin account' });
      }
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
