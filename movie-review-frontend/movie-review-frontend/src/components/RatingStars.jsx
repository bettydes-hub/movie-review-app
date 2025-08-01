import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating, onRatingChange, readonly = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const handleClick = (selectedRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (hoverRating) => {
    if (!readonly) {
      // Add hover effect logic here if needed
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${sizeClasses[size]} cursor-pointer transition-colors ${
            readonly ? 'cursor-default' : 'hover:text-yellow-400'
          } ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
        />
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default RatingStars; 