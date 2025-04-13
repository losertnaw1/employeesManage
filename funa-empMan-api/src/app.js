const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Tạo thư mục uploads/cvs nếu chưa tồn tại
const uploadsDir = path.join(process.cwd(), 'uploads');
const cvsDir = path.join(uploadsDir, 'cvs');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(cvsDir)) {
    fs.mkdirSync(cvsDir);
}

const app = express();

// Configure CORS to allow credentials
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'https://employeesmanage-a807d.web.app'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // For parsing cookies with refresh tokens

connectDB();

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);

// Static files
app.use('/uploads', express.static('uploads')); // Cho phép truy cập file tĩnh

module.exports = app;
