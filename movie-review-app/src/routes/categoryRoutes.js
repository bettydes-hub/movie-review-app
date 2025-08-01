// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories);

// POST /api/categories - Create a new category
router.post('/', categoryController.createCategory);

// GET /api/categories/:id - Get a single category by its ID
router.get('/:id', categoryController.getCategoryById);

// PUT /api/categories/:id - Update a category by its ID
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category by its ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
