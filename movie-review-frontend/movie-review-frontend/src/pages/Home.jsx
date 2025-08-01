import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaUsers } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { moviesAPI } from '../services/api';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await moviesAPI.getAll({ limit: 6, sortBy: 'title', sortOrder: 'ASC' });
        setFeaturedMovies(response.data.movies || response.data);
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  if (loading) {
    return <Loader text="Loading featured movies..." />;
  }

  return (
    <div className="min-h-screen bg-movie-pattern custom-cursor">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-theater-primary/90 via-theater-secondary/80 to-theater-accent/90"></div>
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-theater-silver glow-blue animate-fade-in">
              Discover Amazing Movies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-theater-silver/90 animate-slide-up">
              Read reviews, share your thoughts, and find your next favorite film
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/movies"
                className="btn-primary px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 glow-blue"
              >
                <FaPlay />
                <span>Browse Movies</span>
              </Link>
              <Link
                to="/register"
                className="glass border-2 border-theater-blue text-theater-silver px-8 py-3 rounded-lg font-semibold hover:bg-theater-blue/20 transition-all duration-300 glow-purple"
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass p-6 rounded-lg shadow-md glow-blue hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-theater-blue mb-2">
                {featuredMovies.length}+
              </div>
              <div className="text-theater-silver/80">Movies Reviewed</div>
            </div>
            <div className="glass p-6 rounded-lg shadow-md glow-gold hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-theater-gold mb-2">
                <FaStar className="inline text-theater-gold mr-2" />
                4.5
              </div>
              <div className="text-theater-silver/80">Average Rating</div>
            </div>
            <div className="glass p-6 rounded-lg shadow-md glow-purple hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-theater-purple mb-2">
                <FaUsers className="inline mr-2" />
                1K+
              </div>
              <div className="text-theater-silver/80">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-theater-silver mb-4 glow-blue">
              Featured Movies
            </h2>
            <p className="text-theater-silver/80 text-lg">
              Discover the most popular and highly-rated movies
            </p>
          </div>

          {featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-theater-silver/60 text-lg mb-6">
                No movies available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/movies"
              className="btn-primary px-8 py-3 rounded-lg font-semibold glow-blue"
            >
              View All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-theater-primary/95 via-theater-secondary/90 to-theater-accent/95"></div>
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-theater-silver glow-purple">
            Ready to Share Your Thoughts?
          </h2>
          <p className="text-xl text-theater-silver/90 mb-8">
            Join thousands of movie enthusiasts and start reviewing today
          </p>
          <Link
            to="/register"
            className="btn-primary px-8 py-3 rounded-lg font-semibold glow-blue"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 