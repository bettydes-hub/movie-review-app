import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaFilm, FaSave, FaTimes, FaUpload, FaCalendar, FaTag, FaFileAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import ImageUpload from '../components/ImageUpload';

const AddMovie = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    categoryId: '',
    director: '',
    cast: '',
    duration: '',
    rating: 'PG',
    posterUrl: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('🎬 AddMovie component mounted, fetching categories...');
    fetchCategories();
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log('🔗 Testing backend connection...');
      await fetch('http://localhost:3000/api/categories');
      console.log('✅ Backend is accessible');
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      toast.error('Cannot connect to server. Please make sure the backend is running.');
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      setCategoriesLoading(true);
      const response = await categoriesAPI.getAll();
      console.log('✅ Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.director.trim()) {
      newErrors.director = 'Director is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.duration || formData.duration < 1 || formData.duration > 999) {
      newErrors.duration = 'Duration must be between 1 and 999 minutes';
    }

    if (!formData.releaseYear || formData.releaseYear < 1888 || formData.releaseYear > new Date().getFullYear() + 1) {
      newErrors.releaseYear = 'Release year must be between 1888 and next year';
    }

    if (!selectedImage) {
      newErrors.image = 'Movie poster is required';
    }

    return newErrors;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      director: true,
      description: true,
      categoryId: true,
      duration: true,
      releaseYear: true,
      image: true
    });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const movieFormData = new FormData();
      movieFormData.append('title', formData.title);
      movieFormData.append('director', formData.director);
      movieFormData.append('description', formData.description);
      movieFormData.append('categoryId', formData.categoryId);
      movieFormData.append('duration', formData.duration);
      movieFormData.append('releaseYear', formData.releaseYear);
      movieFormData.append('cast', formData.cast);
      movieFormData.append('rating', formData.rating);
      
      // Add image file if selected
      if (selectedImage) {
        movieFormData.append('image', selectedImage);
      }

      console.log('📤 Submitting movie data with FormData');
      console.log('📤 FormData entries:');
      for (let [key, value] of movieFormData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      await moviesAPI.create(movieFormData);
      
      console.log('✅ Movie created successfully!');
      toast.success('Movie added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        director: '',
        description: '',
        categoryId: '',
        duration: '',
        releaseYear: '',
        cast: '',
        rating: 'PG',
        posterUrl: ''
      });
      setSelectedImage(null);
      setErrors({});
      setTouched({});
      
      // Navigate to movies list
      navigate('/movies');
      
    } catch (error) {
      console.error('❌ Error creating movie:', error);
      
      let errorMessage = 'Failed to add movie. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'You are not authorized to add movies. Please log in as admin.';
        } else if (status === 400) {
          errorMessage = data.message || 'Invalid movie data. Please check your input.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      releaseYear: new Date().getFullYear(),
      categoryId: '',
      posterUrl: '',
      director: '',
      cast: '',
      duration: '',
      rating: 'PG'
    });
    setSelectedImage(null);
    setErrors({});
  };

  if (categoriesLoading) {
    return <Loader text="Loading categories..." />;
  }

  return (
    <div className="min-h-screen bg-movie-pattern py-8 custom-cursor">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="glass rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaFilm className="text-3xl text-theater-blue mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-theater-silver">Add New Movie</h1>
                <p className="text-theater-silver/80">Add a new movie to the database</p>
              </div>
            </div>
          </div>

          {/* Movie Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Release Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full form-dark ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter movie title"
                />
                {errors.title && (
                  <p className="error-dark text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  <FaCalendar className="inline mr-2" />
                  Release Year *
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className={`w-full form-dark ${
                    errors.releaseYear ? 'border-red-500' : ''
                  }`}
                />
                {errors.releaseYear && (
                  <p className="error-dark text-sm mt-1">{errors.releaseYear}</p>
                )}
              </div>
            </div>

            {/* Genre and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  <FaTag className="inline mr-2" />
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`w-full select-dark ${
                    errors.categoryId ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="error-dark text-sm mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  Rating
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full select-dark"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>
            </div>

            {/* Director and Cast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  Director *
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className={`w-full form-dark ${
                    errors.director ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter director name"
                />
                {errors.director && (
                  <p className="error-dark text-sm mt-1">{errors.director}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  Cast *
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  className={`w-full form-dark ${
                    errors.cast ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter cast members (comma separated)"
                />
                {errors.cast && (
                  <p className="error-dark text-sm mt-1">{errors.cast}</p>
                )}
              </div>
            </div>

            {/* Duration and Poster URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium label-dark mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="999"
                  className={`w-full form-dark ${
                    errors.duration ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter duration in minutes"
                />
                {errors.duration && (
                  <p className="error-dark text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUpload className="inline mr-2" />
                  Movie Poster *
                </label>
                <ImageUpload
                  onImageSelected={(file) => {
                    console.log('🖼️ Image selected:', file ? file.name : 'null');
                    setSelectedImage(file);
                    if (errors.image) {
                      setErrors(prev => ({ ...prev, image: '' }));
                    }
                  }}
                  currentImage={selectedImage}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                
                {/* Info about file uploads */}
                <div className="mt-2 p-3 glass-dark border border-theater-blue/30 rounded-md">
                  <p className="text-sm text-theater-silver">
                    <strong>💡 Tip:</strong> Images are uploaded using Multer and stored as files on the server. 
                    This provides better performance and proper file management!
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium label-dark mb-2">
                <FaFileAlt className="inline mr-2" />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className={`w-full textarea-dark ${
                  errors.description ? 'border-red-500' : ''
                }`}
                placeholder="Enter movie description..."
              />
              {errors.description && (
                <p className="error-dark text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Preview */}
            {formData.posterUrl && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Poster Preview</h3>
                <div className="flex justify-center">
                  <img
                    src={formData.posterUrl}
                    alt="Movie poster preview"
                    className="max-w-xs h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      toast.error('Invalid poster URL');
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-theater-blue/20">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center px-6 py-3 glow-blue disabled:opacity-50"
              >
                <FaSave className="mr-2" />
                {loading ? 'Adding Movie...' : 'Add Movie'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary flex items-center px-6 py-3"
              >
                <FaTimes className="mr-2" />
                Reset Form
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/movies')}
                className="flex items-center px-6 py-3 glass border-2 border-theater-blue/30 text-theater-silver rounded-lg hover:bg-theater-blue/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
