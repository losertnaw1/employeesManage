const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const functions = require('firebase-functions');
const Admin = require('../models/Admin');

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
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Create default admin
const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB. Aborting.');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('Generated password hash:', hashedPassword);

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'System Administrator',
      role: 'superadmin',
      status: 'active'
    });

    await admin.save();
    console.log('Default admin created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');

    // Find and display the admin to verify
    const savedAdmin = await Admin.findOne({ username: 'admin' });
    console.log('Saved admin:', {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      role: savedAdmin.role,
      status: savedAdmin.status
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating default admin:', error);
    process.exit(1);
  }
};

// Export for Firebase Functions
exports.createAdmin = functions.https.onRequest(async (req, res) => {
  try {
    await createDefaultAdmin();
    res.status(200).send('Default admin created successfully');
  } catch (error) {
    res.status(500).send(`Error creating default admin: ${error.message}`);
  }
});

// Run directly if called from command line
if (require.main === module) {
  createDefaultAdmin();
}
