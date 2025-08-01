// src/routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET /api/roles - Get all roles
router.get('/', roleController.getAllRoles);

// POST /api/roles - Create a new role
router.post('/', roleController.createRole);

// GET /api/roles/:id - Get a single role by its ID
router.get('/:id', roleController.getRoleById);

// PUT /api/roles/:id - Update a role by its ID
router.put('/:id', roleController.updateRole);

// DELETE /api/roles/:id - Delete a role by its ID
router.delete('/:id', roleController.deleteRole);

module.exports = router;
