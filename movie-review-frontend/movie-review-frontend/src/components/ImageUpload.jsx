import React, { useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageSelected, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Check if file is PNG or JPEG
    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      toast.error('Please select a PNG or JPEG file only');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Notify parent component with the file object
    onImageSelected(file);
    toast.success('Image selected successfully!');
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelected(null);
    
    // Clear the file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    
    toast.info('Image removed');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Movie Poster (PNG or JPEG) *
      </label>
      
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload PNG or JPEG image
            </p>
            <p className="text-xs text-gray-500">
              Maximum size: 5MB
            </p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Movie poster preview"
            className="w-full max-w-xs h-auto rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 