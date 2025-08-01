import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  console.log('🎬 MovieCard received movie:', movie);
  console.log('🎬 Movie ID:', movie?.id);
  console.log('🎬 Movie title:', movie?.title);
  
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (!movie.image) {
      console.log('🎬 No image for movie:', movie.title);
      return 'https://via.placeholder.com/300x450?text=No+Poster';
    }
    
    // If it's already a full URL, return as is
    if (movie.image.startsWith('http://') || movie.image.startsWith('https://')) {
      console.log('🎬 Full URL image for movie:', movie.title, movie.image);
      return movie.image;
    }
    
    // If it's a relative path, make it absolute
    // Handle both seeded images (/movie-images/...) and uploaded images (/uploads/...)
    const fullUrl = `http://localhost:3000${movie.image}`;
    console.log('🎬 Constructed image URL for movie:', movie.title, fullUrl);
    return fullUrl;
  };

  const handleImageError = () => {
    console.log('Image failed to load:', movie.image);
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Movie Poster */}
      <div className="relative">
        <img
          src={imageError ? 'https://via.placeholder.com/300x450?text=Image+Not+Found' : getImageUrl()}
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {movie.director}
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Category */}
        {movie.Category && (
          <p className="text-sm text-gray-600 mb-2">
            {movie.Category.category}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {movie.description || 'No description available.'}
        </p>

        <Link
          to={`/movies/${movie.id}`}
          onClick={() => console.log('🎬 Clicked movie with ID:', movie.id, 'Title:', movie.title)}
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard; 