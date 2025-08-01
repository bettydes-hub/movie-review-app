// src/controllers/roleController.js
const Role = require('../models/role');
const User = require('../models/user');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Role name is required.' });
    }
    const role = await Role.create({ name });
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create role', error: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roles', error: error.message });
  }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch role', error: error.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    await role.update({ name });
    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    // Find the default role 'user'
    const defaultRole = await Role.findOne({ where: { name: 'user' } });
    if (defaultRole) {
      // Reassign users to the default role
      await User.update({ roleId: defaultRole.id }, { where: { roleId: role.id } });
    } else {
      // If no default role, set roleId to NULL
      await User.update({ roleId: null }, { where: { roleId: role.id } });
    }
    await role.destroy();
    res.json({ message: 'Role deleted successfully. Users were reassigned to the default role or set to NULL.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete role', error: error.message });
  }
};
