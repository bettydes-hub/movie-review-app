// src/middlewares/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

module.exports = async function (req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Get user with role information
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Check if user is admin
    if (user.Role.name !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}; 