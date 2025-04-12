const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Delete existing admin
    await Admin.deleteOne({ username: 'admin' });
    console.log('Existing admin deleted');

    // Create a new admin with bcrypt directly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'System Administrator',
      role: 'superadmin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin reset successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin:', err);
    process.exit(1);
  }
};

resetAdmin();
