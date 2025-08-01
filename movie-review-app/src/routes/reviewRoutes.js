// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');

// GET /api/reviews - Get all reviews (Protected)
router.get('/', auth, reviewController.getAllReviews);

// GET /api/reviews/movie - Get reviews by movie ID (Public)
router.get('/movie', reviewController.getReviewsByMovie);

// POST /api/reviews - Create a new review (Protected)
router.post('/', auth, reviewController.createReview);

// GET /api/reviews/:id - Get a single review by its ID (Protected)
router.get('/:id', auth, reviewController.getReviewById);

// PUT /api/reviews/:id - Update a review by its ID (Protected)
router.put('/:id', auth, reviewController.updateReview);

// DELETE /api/reviews/:id - Delete a review by its ID (Protected)
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
