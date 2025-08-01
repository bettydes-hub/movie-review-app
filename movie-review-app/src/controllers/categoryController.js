// src/controllers/categoryController.js
const Category = require('../models/category');
const Movie = require('../models/movie');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    const cat = await Category.create({ category });
    res.status(201).json({ message: 'Category created successfully', category: cat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const cat = await Category.findByPk(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await cat.update({ category });
    res.json({ message: 'Category updated successfully', category: cat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await cat.destroy();
    // Find all movies with categoryId: null
    const uncategorizedMovies = await Movie.findAll({ where: { categoryId: null } });
    // Soft constraint: Prompt admin to reassign these movies before they are shown to end-users
    res.json({
      message: 'Category deleted successfully. The following movies are now uncategorized and should be reassigned before being shown to users.',
      uncategorizedMovies
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};
