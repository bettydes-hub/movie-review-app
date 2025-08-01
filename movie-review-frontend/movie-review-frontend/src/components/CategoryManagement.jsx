import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoriesAPI } from '../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    category: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate field in real-time
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'category':
        if (!value.trim()) {
          error = 'Category name is required';
        } else if (value.length < 2) {
          error = 'Category name must be at least 2 characters long';
        } else if (value.length > 50) {
          error = 'Category name must be less than 50 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    // Mark field as touched
    setTouched({ category: true });
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await categoriesAPI.create({ category: formData.category.trim() });
      toast.success('Category created successfully!');
      setFormData({ category: '' });
      setShowAddForm(false);
      setErrors({});
      setTouched({});
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create category';
      toast.error(message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await categoriesAPI.update(editingCategory.id, { category: formData.category.trim() });
      toast.success('Category updated successfully!');
      setFormData({ category: '' });
      setEditingCategory(null);
      setErrors({});
      setTouched({});
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete category "${categoryName}"? This action cannot be undone and may affect movies using this category.`)) {
      try {
        const response = await categoriesAPI.delete(categoryId);
        toast.success('Category deleted successfully!');
        
        // Show warning if there are uncategorized movies
        if (response.data.uncategorizedMovies && response.data.uncategorizedMovies.length > 0) {
          toast.warning(`${response.data.uncategorizedMovies.length} movies are now uncategorized and should be reassigned.`);
        }
        
        fetchCategories();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete category';
        toast.error(message);
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({ category: category.category });
    setErrors({});
    setTouched({});
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({ category: '' });
    setErrors({});
    setTouched({});
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return 'default';
    if (errors[fieldName]) return 'error';
    if (formData[fieldName]) return 'success';
    return 'default';
  };

  const getFieldIcon = (fieldName) => {
    const status = getFieldStatus(fieldName);
    if (status === 'success') return <FaCheck className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <FaTimes className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getFieldClasses = (fieldName) => {
    const status = getFieldStatus(fieldName);
    const baseClasses = "appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm";
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
      case 'success':
        return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
      default:
        return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Category Management</h2>
          <p className="text-gray-600">Manage movie categories and genres</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && !editingCategory && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <div className="relative">
                <input
                  id="category"
                  name="category"
                  type="text"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClasses('category')}
                  placeholder="Enter category name (e.g., Action, Drama, Comedy)"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('category')}
                </div>
              </div>
              {touched.category && errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ category: '' });
                  setErrors({});
                  setTouched({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Object.keys(errors).some(key => errors[key])}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Category</h3>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <div className="relative">
                <input
                  id="editCategory"
                  name="category"
                  type="text"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={getFieldClasses('category')}
                  placeholder="Enter category name"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('category')}
                </div>
              </div>
              {touched.category && errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Object.keys(errors).some(key => errors[key])}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Update Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">#{category.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      disabled={editingCategory?.id === category.id}
                      className="text-blue-600 hover:text-blue-900 transition-colors disabled:text-gray-400"
                      title="Edit category"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.category)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete category"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement; 