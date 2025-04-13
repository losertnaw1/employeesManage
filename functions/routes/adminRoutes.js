const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// Admin routes
router.get('/', authorizeRoles('superadmin'), adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/', authorizeRoles('superadmin'), adminController.createAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', authorizeRoles('superadmin'), adminController.deleteAdmin);

module.exports = router;
