const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Define Admin schema directly in this script
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'editor'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  token_version: {
    type: Number,
    default: 1
  },
  last_login_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', adminSchema);

const createAdmin = async () => {
  try {
    // Delete existing admin
    await Admin.deleteMany({ username: 'admin' });
    console.log('Deleted existing admin accounts');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('Generated password hash:', hashedPassword);

    // Create new admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'System Administrator',
      role: 'superadmin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    // Find and display the admin to verify
    const savedAdmin = await Admin.findOne({ username: 'admin' });
    console.log('Saved admin:', {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      password_hash: savedAdmin.password_hash,
      role: savedAdmin.role,
      status: savedAdmin.status
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
