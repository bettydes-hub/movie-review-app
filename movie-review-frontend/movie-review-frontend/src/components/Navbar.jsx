import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="nav-dark text-white shadow-lg custom-cursor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-theater-silver glow-blue">MovieReview</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/movies" className="nav-link">
              Movies
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="input-dark w-64 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-theater-blue"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theater-silver hover:text-theater-blue transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <FaCog className="mr-2" />
                      Admin
                    </Link>
                    <Link
                      to="/add-movie"
                      className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Movie
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                >
                  <FaUser />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Movies
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="px-3 py-2 space-y-2">
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="block w-full bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaCog className="inline mr-2" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/add-movie"
                        className="block w-full bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Add Movie
                      </Link>
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="inline mr-2" />
                    {user?.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 transition-colors"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
