const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { createUploadDirectories } = require('./utils/fileUtils');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Create upload directories
createUploadDirectories();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try to get MongoDB URI from environment variables first, then from Firebase config, then fallback to default
    const mongoURI = process.env.MONGO_URI ||
                     (functions.config().mongodb ? functions.config().mongodb.uri : null) ||
                     'mongodb+srv://trphuong1305:zwHoIEJ1Yh1iP6Ok@cluster0-funa.ai2tq.mongodb.net/funa?retryWrites=true&w=majority';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import routes
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Export the API as a Firebase Function
exports.api = functions.https.onRequest(app);

// Export the createAdmin function
exports.createAdmin = require('./scripts/createDefaultAdmin').createAdmin;
