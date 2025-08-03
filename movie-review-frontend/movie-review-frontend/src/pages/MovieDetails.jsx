import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaTag, FaStar, FaUsers, FaTrash, FaEdit } from 'react-icons/fa';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import SimilarMovies from '../components/SimilarMovies';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { moviesAPI, reviewsAPI } from '../services/api';
import { toast } from 'react-toastify';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [similarMoviesLoading, setSimilarMoviesLoading] = useState(true);
  const [similarMoviesError, setSimilarMoviesError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    try {
      console.log('🔍 Fetching movie details for ID:', id);
      
      // Double-check ID validation
      if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ Invalid movie ID in fetchMovieDetails:', id);
        return;
      }
      
      const response = await moviesAPI.getById(id);
      console.log('✅ Movie details response:', response.data);
      setMovie(response.data);
    } catch (error) {
      console.error('❌ Error fetching movie details:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      // Double-check ID validation
      if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ Invalid movie ID in fetchReviews:', id);
        return;
      }
      
      console.log('🔍 Fetching reviews for movie ID:', id);
      const response = await reviewsAPI.getByMovie(id);
      console.log('✅ Reviews fetched:', response.data);
      console.log('📊 Number of reviews:', response.data.length);
      
      setReviews(response.data);
      
      // Check if user has already rated this movie
      if (isAuthenticated && user) {
        const userReview = response.data.find(review => review.user_id === user.id);
        if (userReview) {
          console.log('👤 User has already rated this movie:', userReview.rating);
          setUserRating(userReview.rating);
          setHasRated(true);
        } else {
          console.log('👤 User has not rated this movie yet');
          setUserRating(0);
          setHasRated(false);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      console.error('❌ Error response:', error.response?.data);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, isAuthenticated, user]);

  const fetchSimilarMovies = useCallback(async () => {
    try {
      // Double-check ID validation
      if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ Invalid movie ID in fetchSimilarMovies:', id);
        return;
      }
      
      console.log('🔍 Fetching similar movies for movie ID:', id);
      const response = await moviesAPI.getSimilar(id, 6);
      console.log('✅ Similar movies fetched:', response.data);
      console.log('📊 Number of similar movies:', response.data.similarMovies?.length || 0);
      
      setSimilarMovies(response.data.similarMovies || []);
      setSimilarMoviesError(null);
    } catch (error) {
      console.error('❌ Error fetching similar movies:', error);
      console.error('❌ Error response:', error.response?.data);
      setSimilarMoviesError(error.message);
      setSimilarMovies([]);
    } finally {
      setSimilarMoviesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    console.log('🎬 MovieDetails useEffect triggered with ID:', id);
    console.log('🎬 ID type:', typeof id);
    
    // Validate ID before making API calls
    if (!id || id === 'undefined' || id === 'null') {
      console.error('❌ Invalid movie ID:', id);
      setLoading(false);
      setReviewsLoading(false);
      return;
    }
    
    fetchMovieDetails();
    fetchReviews();
    fetchSimilarMovies();
  }, [id, fetchMovieDetails, fetchReviews, fetchSimilarMovies]);



  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchMovieDetails(); // Refresh movie data to update average rating
  };

  const handleReviewUpdated = () => {
    fetchReviews();
    fetchMovieDetails();
  };

  const handleReviewDeleted = () => {
    fetchReviews();
    fetchMovieDetails();
  };

  const handleDeleteMovie = async () => {
    if (!isAdmin) {
      toast.error('Only admins can delete movies');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${movie.title}"? This action cannot be undone.`)) {
      try {
        await moviesAPI.delete(id);
        toast.success('Movie deleted successfully');
        navigate('/movies');
      } catch (error) {
        console.error('Error deleting movie:', error);
        toast.error('Failed to delete movie');
      }
    }
  };

  const handleRatingChange = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate movies');
      return;
    }

    setUserRating(rating);
    
    try {
      if (hasRated) {
        // Update existing review
        const userReview = reviews.find(review => review.user_id === user.id);
        if (userReview) {
          await reviewsAPI.update(userReview.id, { rating });
          toast.success('Rating updated successfully');
        }
      } else {
        // Create new review with just rating
        await reviewsAPI.create(id, { rating, comment: 'Rated this movie' });
        setHasRated(true);
        toast.success('Rating submitted successfully');
      }
      
      // Refresh reviews and movie data
      fetchReviews();
      fetchMovieDetails();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  if (loading) {
    return <Loader text="Loading movie details..." />;
  }

  if (!id || id === 'undefined' || id === 'null') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Movie ID</h1>
          <p className="text-gray-600 mb-4">The movie ID is invalid or missing.</p>
          <button
            onClick={() => navigate('/movies')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h1>
          <p className="text-gray-600 mb-4">The movie you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/movies')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  // Use movie's stored review statistics instead of calculating from reviews array
  const averageRating = movie?.averageRating || 0;
  const reviewCount = movie?.reviewCount || reviews.length;

  return (
    <div className="min-h-screen bg-movie-pattern py-8 custom-cursor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Movie Header */}
        <div className="glass rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              <img
                src={movie.image ? `http://localhost:3000${movie.image}` : 'https://via.placeholder.com/400x600?text=No+Poster'}
                alt={movie.title}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', movie.image);
                  e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-theater-silver">{movie.title}</h1>
                
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/movies/${id}/edit`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteMovie}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <FaTrash size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              {/* Movie Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-theater-silver/80">
                {movie.releaseYear && (
                  <div className="flex items-center space-x-2">
                    <FaCalendar />
                    <span>{movie.releaseYear}</span>
                  </div>
                )}
                {movie.Category && (
                  <div className="flex items-center space-x-2">
                    <FaTag />
                    <span>{movie.Category.category}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center space-x-2">
                    <FaUsers />
                    <span>{movie.duration} min</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-400" />
                  <span>{averageRating}/5 ({reviewCount} reviews)</span>
                </div>
              </div>

              {/* Cast Information */}
              {movie.cast && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-theater-silver mb-2">Cast</h3>
                  <p className="text-theater-silver/80">{movie.cast}</p>
                </div>
              )}

              {/* Director */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-theater-silver mb-2">Director</h3>
                <p className="text-theater-silver/80">{movie.director}</p>
              </div>

              {/* User Rating Section */}
              {isAuthenticated && (
                <div className="mb-6 p-4 glass-dark rounded-lg">
                  <h3 className="text-lg font-semibold text-theater-silver mb-3">
                    {hasRated ? 'Your Rating' : 'Rate this Movie'}
                  </h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={`text-2xl transition-colors ${
                          star <= userRating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">
                      {userRating > 0 ? `${userRating}/5` : 'Click to rate'}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-theater-silver mb-2">Description</h3>
                <p className="text-theater-silver/80 leading-relaxed">
                  {movie.description || 'No description available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {isAuthenticated && (
                  <button
                    onClick={() => document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
                {!isAuthenticated && (
                  <div className="text-theater-silver/80">
                    <a href="/login" className="text-theater-blue hover:text-theater-blue/80">
                      Sign in
                    </a>{' '}
                    to rate and review this movie
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        {isAuthenticated && (
          <div id="review-form" className="mb-8">
            <ReviewForm 
              movieId={id} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        {/* Reviews */}
        <div className="mb-8">
          {reviewsLoading ? (
            <Loader text="Loading reviews..." />
          ) : (
            <ReviewList
              reviews={reviews}
              onReviewUpdated={handleReviewUpdated}
              onReviewDeleted={handleReviewDeleted}
            />
          )}
        </div>

        {/* Similar Movies */}
        <SimilarMovies
          similarMovies={similarMovies}
          loading={similarMoviesLoading}
          error={similarMoviesError}
        />
      </div>
    </div>
  );
};

export default MovieDetails; 