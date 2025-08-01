import axios from 'axios';

// Get base URL for API
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_API_BASE_URL;
  if (envURL) return envURL;
  
  // Use localhost for development
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Debug: Log the base URL
console.log('🔗 API Base URL:', getBaseURL());

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('📡 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('🔗 Full URL:', config.baseURL + config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData uploads, don't set Content-Type (let browser set it with boundary)
    if (config.data instanceof FormData) {
      console.log('📁 FormData detected - removing Content-Type header');
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.log('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't redirect automatically - let the component handle it
      console.log('Unauthorized access - token removed');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  me: () => api.get('/users/profile'),
};

// Movies API
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  getSimilar: (id, limit = 6) => api.get(`/movies/${id}/similar`, { params: { limit } }),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`),
  search: (query) => api.get(`/movies?search=${query}`),
};

// Reviews API
export const reviewsAPI = {
  getByMovie: (movieId) => api.get(`/reviews/movie?movie_id=${movieId}`),
  create: (movieId, reviewData) => api.post('/reviews', { ...reviewData, movie_id: movieId }),
  update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getUserReviews: () => api.get('/reviews'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => {
    console.log('🌐 Making categories API call...');
    return api.get('/categories').then(response => {
      console.log('✅ Categories API response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ Categories API error:', error);
      throw error;
    });
  },
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Connection test function
export const testConnection = async () => {
  const urls = [
    'http://localhost:3000/api/health',
    'http://127.0.0.1:3000/api/health'
  ];
  
  for (const url of urls) {
    try {
      console.log(`🧪 Testing connection to: ${url}`);
      const response = await axios.get(url, { 
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Connection successful to: ${url}`);
      console.log('Response:', response.data);
      return { success: true, url, data: response.data };
    } catch (error) {
      console.log(`❌ Connection failed to: ${url}`);
      console.log('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
  }
  
  console.log('❌ All connection attempts failed');
  return { success: false };
};

export default api; 