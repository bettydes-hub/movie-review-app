// src/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const { handleImageUpload } = require('../middlewares/uploadMiddleware');

// GET /api/movies - Get all movies (Public)
router.get('/', movieController.getAllMovies);

// GET /api/movies/:id - Get a single movie by ID (Public)
router.get('/:id', movieController.getMovieById);

// GET /api/movies/:id/similar - Get similar movies (Public)
router.get('/:id/similar', movieController.getSimilarMovies);

// POST /api/movies - Create a new movie (Admin only)
router.post('/', adminAuth, handleImageUpload, movieController.createMovie);

// PUT /api/movies/:id - Update a movie (Admin only)
router.put('/:id', adminAuth, handleImageUpload, movieController.updateMovie);

// DELETE /api/movies/:id - Delete a movie (Admin only)
router.delete('/:id', adminAuth, movieController.deleteMovie);

module.exports = router;
