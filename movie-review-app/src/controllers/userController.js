// src/controllers/userController.js
const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Find the 'User' role
    const userRole = await Role.findOne({ where: { name: 'User' } });
    if (!userRole) {
      return res.status(500).json({ message: "Default 'User' role not found. Please contact admin." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use username if provided, otherwise use name
    const userName = username || name;

    // Create the user with the 'user' role
    const user = await User.create({
      name: userName,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        roleId: user.roleId 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Create admin user (admin only)
exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Find the 'Admin' role
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      return res.status(500).json({ message: "Admin role not found. Please contact system administrator." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: adminRole.id,
    });

    res.status(201).json({ 
      message: 'Admin user created successfully', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        roleId: user.roleId 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin user', error: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: 'Role ID is required' });
    }

    // Check if role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }

    // Find and update user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from removing their own admin role
    if (user.id === req.user.id && roleId !== user.roleId) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    await user.update({ roleId });

    // Get updated user with role information
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      message: 'User role updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (you'll need to add middleware for this)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Don't send password
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', { id: user.id, name: user.name, roleId: user.roleId });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', user.id);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Password verified successfully');

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, roleId: user.roleId }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
