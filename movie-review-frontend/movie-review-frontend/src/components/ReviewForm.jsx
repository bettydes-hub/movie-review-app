import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import RatingStars from './RatingStars';
import { reviewsAPI } from '../services/api';

const ReviewForm = ({ movieId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    
    // Clear rating error when user selects a rating
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate field in real-time
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'rating':
        if (value === 0) {
          error = 'Please select a rating';
        }
        break;
        
      case 'comment':
        if (!value.trim()) {
          error = 'Please write a review comment';
        } else if (value.trim().length < 10) {
          error = 'Review must be at least 10 characters long';
        } else if (value.trim().length > 1000) {
          error = 'Review must be less than 1000 characters';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      rating: true,
      comment: true
    });
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Submitting review for movie:', movieId);
      console.log('📝 Review data:', formData);
      
      const response = await reviewsAPI.create(movieId, formData);
      console.log('✅ Review submitted successfully:', response.data);
      
      toast.success('Review submitted successfully! Thank you for your feedback!');
      setFormData({ rating: 0, comment: '' });
      setErrors({});
      setTouched({});
      
      if (onReviewSubmitted) {
        console.log('🔄 Calling onReviewSubmitted callback');
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      console.error('❌ Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to submit review. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return 'default';
    if (errors[fieldName]) return 'error';
    if (formData[fieldName] && fieldName === 'rating' && formData[fieldName] > 0) return 'success';
    if (formData[fieldName] && fieldName === 'comment' && formData[fieldName].trim()) return 'success';
    return 'default';
  };

  const getFieldIcon = (fieldName) => {
    const status = getFieldStatus(fieldName);
    if (status === 'success') return <FaCheck className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <FaTimes className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getFieldClasses = (fieldName) => {
    const status = getFieldStatus(fieldName);
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
      case 'success':
        return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
      default:
        return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-transparent`;
    }
  };

  const getRatingStatus = () => {
    if (!touched.rating) return 'default';
    if (errors.rating) return 'error';
    if (formData.rating > 0) return 'success';
    return 'default';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className={`p-3 border rounded-lg ${getRatingStatus() === 'error' ? 'border-red-300 bg-red-50' : getRatingStatus() === 'success' ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
            <RatingStars
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="large"
            />
            {touched.rating && errors.rating && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FaExclamationTriangle className="h-3 w-3 mr-1" />
                {errors.rating}
              </p>
            )}
            {touched.rating && !errors.rating && formData.rating > 0 && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <FaCheck className="h-3 w-3 mr-1" />
                Rating selected: {formData.rating} star{formData.rating !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <div className="relative">
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              onBlur={handleBlur}
              rows="4"
              className={getFieldClasses('comment')}
              placeholder="Share your thoughts about this movie... (minimum 10 characters)"
              required
            />
            <div className="absolute top-2 right-2">
              {getFieldIcon('comment')}
            </div>
          </div>
          {touched.comment && errors.comment && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaExclamationTriangle className="h-3 w-3 mr-1" />
              {errors.comment}
            </p>
          )}
          {touched.comment && !errors.comment && formData.comment.trim() && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <FaCheck className="h-3 w-3 mr-1" />
              Review looks good! ({formData.comment.trim().length} characters)
            </p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.comment.length}/1000 characters
          </div>
        </div>

        {/* Review Guidelines */}
        <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Review Guidelines:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be respectful and constructive</li>
            <li>• Share your honest opinion</li>
            <li>• Avoid spoilers without warning</li>
            <li>• Minimum 10 characters required</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).some(key => errors[key]) || formData.rating === 0 || !formData.comment.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Review...
            </div>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
