// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const jwt = require('jsonwebtoken');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', auth, userController.getProfile);
router.get('/me', auth, userController.getProfile);

// Admin-only routes (require admin authentication)
router.get('/', adminAuth, userController.getAllUsers);
router.post('/admin', adminAuth, userController.createAdminUser);
router.put('/:userId/role', adminAuth, userController.updateUserRole);
router.delete('/:userId', adminAuth, userController.deleteUser);

module.exports = router;
