import React from 'react';
import MovieCard from './MovieCard';
import Loader from './Loader';

const SimilarMovies = ({ similarMovies, loading, error }) => {
  if (loading) {
    return (
      <div className="glass rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-theater-silver mb-6">You might also like</h2>
        <Loader text="Finding similar movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-theater-silver mb-6">You might also like</h2>
        <p className="text-theater-silver/80 text-center py-8">
          Unable to load similar movies at the moment.
        </p>
      </div>
    );
  }

  if (!similarMovies || similarMovies.length === 0) {
    return (
      <div className="glass rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-theater-silver mb-6">You might also like</h2>
        <p className="text-theater-silver/80 text-center py-8">
          No similar movies found at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-theater-silver mb-6">You might also like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {similarMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {similarMovies.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-theater-silver/60">
            Based on director, category, and release year
          </p>
        </div>
      )}
    </div>
  );
};

export default SimilarMovies; 