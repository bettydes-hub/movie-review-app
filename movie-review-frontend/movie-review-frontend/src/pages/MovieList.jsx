import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { moviesAPI, categoriesAPI } from '../services/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'title',
    sortOrder: searchParams.get('sortOrder') || 'asc'
  });

  useEffect(() => {
    fetchMovies();
    fetchCategories();
    testBackendConnection();
  }, [filters, fetchMovies, fetchCategories, testBackendConnection]);

  // Refresh movies when component comes into focus (e.g., after adding a movie)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 MovieList component focused, refreshing data...');
      fetchMovies();
      fetchCategories();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchMovies, fetchCategories]);

  // Generate suggestions from existing movies
  const generateSuggestions = (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const allSuggestions = [];
    
    // Add movie titles
    movies.forEach(movie => {
      if (movie.title && movie.title.toLowerCase().includes(input.toLowerCase())) {
        allSuggestions.push({
          text: movie.title,
          type: 'Movie Title'
        });
      }
    });

    // Add director names
    movies.forEach(movie => {
      if (movie.director && movie.director.toLowerCase().includes(input.toLowerCase())) {
        allSuggestions.push({
          text: movie.director,
          type: 'Director'
        });
      }
    });

    // Remove duplicates and limit to 5 suggestions
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.text === suggestion.text)
    ).slice(0, 5);

    console.log('🔍 Generated suggestions:', uniqueSuggestions);
    setSuggestions(uniqueSuggestions);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion.text);
    setShowSuggestions(false);
    setSuggestions([]);
    
    const newFilters = { ...filters, search: suggestion.text };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: filters.search,
        category: filters.category,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };
      
      console.log('🎬 Fetching movies with params:', params);
      const response = await moviesAPI.getAll(params);
      console.log('🎬 Movies API response:', response);
      console.log('🎬 Movies data:', response.data);
      
      const moviesData = response.data.movies || response.data;
      console.log('🎬 Final movies array:', moviesData);
      console.log('🎬 Number of movies:', moviesData.length);
      
      if (moviesData.length > 0) {
        console.log('🎬 First movie sample:', {
          id: moviesData[0].id,
          title: moviesData[0].title,
          image: moviesData[0].image ? moviesData[0].image.substring(0, 50) + '...' : 'No image',
          imageLength: moviesData[0].image ? moviesData[0].image.length : 0
        });
      }
      
      setMovies(moviesData);
    } catch (error) {
      console.error('❌ Error fetching movies:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Show user-friendly error
      if (error.response?.status === 404) {
        console.log('❌ API endpoint not found - check if backend is running');
      } else if (error.code === 'ERR_NETWORK') {
        console.log('❌ Network error - cannot connect to backend');
      }
      
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      console.log('🌐 Fetching categories...');
      const response = await categoriesAPI.getAll();
      console.log('🌐 Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      setCategories([]);
    }
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const testBackendConnection = useCallback(async () => {
    try {
      console.log('🔗 Testing backend connection...');
      const response = await fetch('http://localhost:3000/api/health');
      console.log('✅ Backend is accessible:', response.status);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      console.log('💡 Make sure your backend server is running on port 3000');
    }
  }, []);

  if (loading) {
    return <Loader text="Loading movies..." />;
  }

  return (
    <div className="min-h-screen bg-movie-pattern py-8 custom-cursor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-theater-silver mb-2 glow-blue">Movies</h1>
            <p className="text-theater-silver/80">Discover and review amazing films</p>
          </div>
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              fetchMovies();
              fetchCategories();
            }}
            className="btn-primary glow-blue"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="glass rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-theater-silver mb-2">
                Search
              </label>
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by title or director..."
                  className="input-dark flex-1 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-theater-blue"
                />
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-theater-blue"
                >
                  <FaSearch />
                </button>
              </form>
              
                             {/* Autocomplete Suggestions */}
               {showSuggestions && suggestions.length > 0 && (
                 <div className="absolute z-10 w-full mt-1 glass-dark border border-theater-blue/30 rounded-md shadow-lg">
                   {suggestions.map((suggestion, index) => (
                     <div
                       key={index}
                       onClick={() => handleSuggestionClick(suggestion)}
                       className="px-3 py-2 hover:bg-theater-blue/10 cursor-pointer border-b border-theater-blue/20 last:border-b-0 transition-colors"
                     >
                       <div className="font-medium text-theater-silver">{suggestion.text}</div>
                       <div className="text-sm text-theater-silver/70">{suggestion.type}</div>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Category Filter */}
             <div>
               <label className="block text-sm font-medium text-theater-silver mb-2">
                 Category
               </label>
               <select
                 value={filters.category}
                 onChange={(e) => handleFilterChange('category', e.target.value)}
                 className="input-dark w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-theater-blue"
               >
                 <option value="">All Categories</option>
                 {categories.map((category) => (
                   <option key={category.id} value={category.id}>
                     {category.category}
                   </option>
                 ))}
               </select>
             </div>

             {/* Sort By */}
             <div>
               <label className="block text-sm font-medium text-theater-silver mb-2">
                 Sort By
               </label>
               <select
                 value={filters.sortBy}
                 onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                 className="input-dark w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-theater-blue"
               >
                 <option value="title">Title</option>
                 <option value="director">Director</option>
                 <option value="categoryId">Category</option>
               </select>
             </div>

             {/* Sort Order */}
             <div>
               <label className="block text-sm font-medium text-theater-silver mb-2">
                 Order
               </label>
               <select
                 value={filters.sortOrder}
                 onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                 className="input-dark w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-theater-blue"
               >
                 <option value="asc">Ascending</option>
                 <option value="desc">Descending</option>
               </select>
             </div>
          </div>
        </div>

                 {/* Results Count */}
         <div className="mb-6">
           <p className="text-theater-silver/80">
             Showing {movies.length} movie{movies.length !== 1 ? 's' : ''}
           </p>
         </div>

         {/* Movies Grid */}
         {movies.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {movies.map((movie) => {
               console.log('🎬 Rendering MovieCard for movie:', movie);
               return <MovieCard key={movie.id} movie={movie} />;
             })}
           </div>
         ) : (
           <div className="text-center py-12">
             <p className="text-theater-silver/60 text-lg">
               No movies found matching your criteria.
             </p>
           </div>
         )}
      </div>
    </div>
  );
};

export default MovieList;
