const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    // Only superadmin can see all admins
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view all admins' });
    }
    
    const admins = await Admin.find().select('-password_hash');
    res.json(admins);
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    // Check if admin is requesting their own info or is a superadmin
    if (req.admin.id !== req.params.id && req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view this admin' });
    }
    
    const admin = await Admin.findById(req.params.id).select('-password_hash');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    console.error('Get admin by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new admin
exports.createAdmin = async (req, res) => {
  try {
    // Only superadmin can create new admins
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to create admins' });
    }
    
    const { username, email, password, full_name, role } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password_hash: password, // Will be hashed by pre-save hook
      full_name,
      role: role || 'admin', // Default to admin if not specified
      status: 'active',
      token_version: 1
    });
    
    await newAdmin.save();
    
    // Return the new admin without password
    const adminToReturn = newAdmin.toObject();
    delete adminToReturn.password_hash;
    
    res.status(201).json(adminToReturn);
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, full_name, role, status, password } = req.body;
    
    // Check if admin is updating their own info or is a superadmin
    const isSelfUpdate = req.admin.id === id;
    const isSuperAdmin = req.admin.role === 'superadmin';
    
    if (!isSelfUpdate && !isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this admin' });
    }
    
    // Only superadmin can change roles or status
    if ((role || status) && !isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to change role or status' });
    }
    
    // Find admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    // Update fields
    if (email) admin.email = email;
    if (full_name) admin.full_name = full_name;
    if (isSuperAdmin && role) admin.role = role;
    if (isSuperAdmin && status) admin.status = status;
    
    // Update password if provided
    if (password) {
      admin.password_hash = password; // Will be hashed by pre-save hook
      admin.token_version += 1; // Invalidate all refresh tokens
    }
    
    admin.updated_at = new Date();
    await admin.save();
    
    // Return updated admin without password
    const adminToReturn = admin.toObject();
    delete adminToReturn.password_hash;
    
    res.json(adminToReturn);
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    // Only superadmin can delete admins
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete admins' });
    }
    
    // Prevent self-deletion
    if (req.admin.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
