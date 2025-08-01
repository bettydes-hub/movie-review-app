import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with auth token
const createAuthInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const imageAPI = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await createAuthInstance().post('/movies/upload-image', formData);
    return response.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    const response = await createAuthInstance().post('/movies/upload-images', formData);
    return response.data;
  },

  // Delete image from Cloudinary
  deleteImage: async (imageUrl) => {
    const response = await createAuthInstance().delete('/movies/delete-image', {
      data: { imageUrl }
    });
    return response.data;
  }
};

export default imageAPI; 