import React from 'react';
import { FaHeart, FaCode, FaUsers, FaStar, FaFilm, FaUser } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MovieScope</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Welcome to MovieScope – your go-to hub for honest, spoiler-free movie reviews. This platform blends a love for storytelling with the power of technology, aiming to help people discover great films through insightful reviews, fair ratings, and community feedback. All reviews are written by verified users or admins, and users can rate, comment, or suggest movies to others. Built with React, Node.js, Express, and MongoDB, and powered by Cloudinary for image hosting, MovieScope is more than just a review site – it's a growing community of movie lovers. Ready to dive in? Sign up today and start sharing your thoughts.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Sign Up Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 