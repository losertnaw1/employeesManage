const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Auth routes
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Add a test route that doesn't require authentication
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

router.get('/me', authenticateToken, authController.getCurrentAdmin);

// Password reset routes
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Admin creation route
router.post('/create-default-admin', authController.createDefaultAdmin);

module.exports = router;
