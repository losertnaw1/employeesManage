const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const RefreshToken = require('../models/RefreshToken');
const PasswordReset = require('../models/PasswordReset');
const nodemailer = require('nodemailer');

// Environment variables (should be in .env file)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Email configuration (should be in .env file)
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-email-password';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Employee Management System <your-email@gmail.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Generate access token
const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      role: admin.role
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
const generateRefreshToken = async (admin, userAgent, ip) => {
  // Create a random token
  const tokenValue = crypto.randomBytes(40).toString('hex');

  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

  // Create and save the refresh token
  const refreshToken = new RefreshToken({
    admin_id: admin._id,
    token: tokenValue,
    user_agent: userAgent,
    ip: ip,
    expires_at: expiryDate
  });

  await refreshToken.save();
  return tokenValue;
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // Verify password
    console.log('Comparing password:', password, 'with hash:', admin.password_hash);
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid?', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(admin);
    const refreshToken = await generateRefreshToken(
      admin,
      req.headers['user-agent'] || 'unknown',
      req.ip
    );

    // Update last login time
    admin.last_login_at = new Date();
    await admin.save();

    // Return both tokens and admin info
    res.json({
      accessToken,
      refreshToken, // Send refresh token in response instead of cookie
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Refresh token controller
exports.refresh = async (req, res) => {
  try {
    // Get refresh token from request body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Find the refresh token in database
    const foundToken = await RefreshToken.findOne({ token: refreshToken });
    if (!foundToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Check if token is expired
    if (new Date() > foundToken.expires_at) {
      await RefreshToken.deleteOne({ _id: foundToken._id });
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    // Find the admin
    const admin = await Admin.findById(foundToken.admin_id);
    if (!admin || admin.status !== 'active') {
      return res.status(403).json({ message: 'Admin account not found or inactive' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(admin);

    // Return new access token and existing refresh token
    res.json({
      accessToken,
      refreshToken: foundToken.token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    // Get refresh token from request body
    const { refreshToken } = req.body;
    if (refreshToken) {
      // Remove the refresh token from database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// Get current admin info
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password_hash');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.full_name,
      role: admin.role,
      status: admin.status
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, username) => {
  const transporter = createTransporter();
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}&username=${encodeURIComponent(username)}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Hello ${username},</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body; // Can be username or email

    if (!identifier) {
      return res.status(400).json({ message: 'Username or email is required' });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (!admin) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({ message: 'If your account exists, a password reset link has been sent to your email' });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(200).json({ message: 'If your account exists, a password reset link has been sent to your email' });
    }

    // Generate reset token
    const resetToken = await PasswordReset.generateToken(admin._id);

    // Send reset email
    await sendPasswordResetEmail(admin.email, resetToken, admin.username);

    res.status(200).json({ message: 'If your account exists, a password reset link has been sent to your email' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, username, newPassword } = req.body;

    if (!token || !username || !newPassword) {
      return res.status(400).json({ message: 'Token, username, and new password are required' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid reset request' });
    }

    // Verify token
    const resetToken = await PasswordReset.verifyToken(token, admin._id);
    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    admin.password_hash = newPassword; // Will be hashed by pre-save hook
    admin.token_version += 1; // Invalidate all refresh tokens
    admin.updated_at = new Date();
    await admin.save();

    // Mark token as used
    await resetToken.markAsUsed();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// Create default admin account
exports.createDefaultAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      return res.status(200).json({ message: 'Default admin already exists', admin: { username: existingAdmin.username, email: existingAdmin.email } });
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: 'admin123', // Will be hashed by pre-save hook
      full_name: 'System Administrator',
      role: 'superadmin',
      status: 'active'
    });

    await admin.save();

    res.status(201).json({
      message: 'Default admin created successfully',
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create default admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};