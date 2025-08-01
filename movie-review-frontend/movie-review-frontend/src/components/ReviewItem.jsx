import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import RatingStars from './RatingStars';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    comment: review.comment
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const isOwner = user?.id === review.user_id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleRatingChange = (rating) => {
    setEditData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (editData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!editData.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsAPI.update(review.id, editData);
      toast.success('Review updated successfully!');
      setIsEditing(false);
      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsAPI.delete(review.id);
      toast.success('Review deleted successfully!');
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <RatingStars
              rating={editData.rating}
              onRatingChange={handleRatingChange}
              size="medium"
            />
          </div>

          <div>
            <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="edit-comment"
              name="comment"
              value={editData.comment}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Review Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {review.User?.name || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Rating */}
        <RatingStars rating={review.rating} readonly size="small" />
      </div>

      {/* Review Content */}
      <p className="text-gray-700 mb-3">{review.comment}</p>

      {/* Action Buttons */}
      {isOwner && (
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            disabled={isSubmitting}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
          >
            <FaEdit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors disabled:text-gray-400"
          >
            <FaTrash size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
