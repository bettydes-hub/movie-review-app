// src/controllers/reviewController.js
const Review = require('../models/review');
const User = require('../models/user');
const Movie = require('../models/movie');

// Helper function to update movie review statistics
const updateMovieReviewStats = async (movie_id) => {
  try {
    // Get all reviews for this movie
    const reviews = await Review.findAll({
      where: { movie_id },
      attributes: ['rating']
    });
    
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(2)
      : 0.00;
    
    // Update the movie
    await Movie.update(
      { 
        reviewCount: reviewCount,
        averageRating: parseFloat(averageRating)
      },
      { where: { id: movie_id } }
    );
    
    console.log(`📊 Updated movie ${movie_id}: ${reviewCount} reviews, ${averageRating} avg rating`);
  } catch (error) {
    console.error('❌ Error updating movie review stats:', error);
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { movie_id, rating, comment } = req.body;
    const user_id = req.user.id; // Get user ID from authenticated request
    
    if (!movie_id || !rating) {
      return res.status(400).json({ message: 'movie_id and rating are required.' });
    }
    
    const review = await Review.create({ user_id, movie_id, rating, comment });
    
    // Update movie review statistics
    await updateMovieReviewStats(movie_id);
    
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['id', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get reviews by movie ID
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movie_id } = req.query;
    if (!movie_id) {
      return res.status(400).json({ message: 'movie_id is required.' });
    }
    
    const reviews = await Review.findAll({
      where: { movie_id },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['id', 'DESC']]
    });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { movie_id, rating, comment } = req.body;
    const user_id = req.user.id; // Get user ID from authenticated request
    
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user owns this review
    if (review.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }
    
    await review.update({ user_id, movie_id, rating, comment });
    
    // Update movie review statistics
    await updateMovieReviewStats(movie_id);
    
    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const user_id = req.user.id; // Get user ID from authenticated request
    
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user owns this review
    if (review.user_id !== user_id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }
    
    const movie_id = review.movie_id; // Store movie_id before deleting
    await review.destroy();
    
    // Update movie review statistics
    await updateMovieReviewStats(movie_id);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};
