const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
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

    // Log the admin object before saving
    console.log('Admin to be created:', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    });

    await admin.save();
    console.log('Default admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating default admin:', err);
    process.exit(1);
  }
};

createDefaultAdmin();
