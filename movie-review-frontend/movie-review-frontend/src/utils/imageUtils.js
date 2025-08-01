// Utility functions for handling images

/**
 * Convert an external image URL to a data URL
 * This helps avoid CORS issues with external image sources
 */
export const convertImageToDataURL = async (imageUrl) => {
  try {
    // Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create a new image element
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Try to enable CORS
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', imageUrl);
        reject(new Error('Failed to load image'));
      };
      
      // Load the image
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error converting image to data URL:', error);
    throw error;
  }
};

/**
 * Check if an image URL is accessible
 */
export const checkImageAccessibility = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Image accessibility check failed:', error);
    return false;
  }
};

/**
 * Get a placeholder image URL
 */
export const getPlaceholderImage = (text = 'No Image') => {
  return `https://via.placeholder.com/300x450/cccccc/666666?text=${encodeURIComponent(text)}`;
};

/**
 * Validate if a URL is a valid image URL
 */
export const isValidImageURL = (url) => {
  if (!url) return false;
  
  // Check if it's a data URL
  if (url.startsWith('data:image/')) return true;
  
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}; 