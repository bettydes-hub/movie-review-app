import React from 'react';
import ReviewItem from './ReviewItem';

const ReviewList = ({ reviews, onReviewUpdated, onReviewDeleted }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review this movie!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Reviews ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onReviewUpdated={onReviewUpdated}
            onReviewDeleted={onReviewDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
