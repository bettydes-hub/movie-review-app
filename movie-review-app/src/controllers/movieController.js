// src/controllers/movieController.js
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Movie = require('../models/movie');
const Category = require('../models/category');
const Review = require('../models/review');
const User = require('../models/user');

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    console.log('🎬 Creating movie with data:', req.body);
    console.log('🎬 File upload info:', req.file);
    console.log('🎬 Request headers:', req.headers['content-type']);
    
    const { title, director, description, categoryId, cast, duration, rating, releaseYear, image } = req.body;
    
    // Get image URL from the uploaded file
    const imageUrl = image || null; // Multer middleware already sets req.body.image
    console.log('🎬 Image URL from request:', imageUrl);
    
    if (!title || !director || !categoryId) {
      console.log('❌ Missing required fields:', { title: !!title, director: !!director, categoryId: !!categoryId });
      return res.status(400).json({ message: 'Title, director, and categoryId are required.' });
    }
    
    const movie = await Movie.create({ 
      title, 
      director, 
      description, 
      categoryId, 
      image: imageUrl,
      cast,
      duration,
      rating,
      releaseYear
    });
    
    console.log('✅ Movie created successfully:', movie.id);
    console.log('✅ Saved image URL:', movie.image);
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    console.error('❌ Error creating movie:', error);
    res.status(500).json({ message: 'Failed to create movie', error: error.message });
  }
};

// Get all movies with search, filtering, and pagination
exports.getAllMovies = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '', 
      sortBy = 'title',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause for search and filtering
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { director: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Include category filter
    const includeClause = [
      {
        model: Category,
        attributes: ['id', 'category'],
        where: category ? { category: { [Op.iLike]: `%${category}%` } } : undefined
      }
    ];

    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('🎬 Backend: Found', count, 'movies');
    if (movies.length > 0) {
      console.log('🎬 Backend: First movie sample:', {
        id: movies[0].id,
        title: movies[0].title,
        image: movies[0].image ? movies[0].image.substring(0, 50) + '...' : 'No image',
        imageLength: movies[0].image ? movies[0].image.length : 0
      });
    }

    const totalPages = Math.ceil(count / limit);

    res.json({
      movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

// Get a single movie by ID with reviews and category
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category']
        },
        {
          model: Review,
          include: [
            {
              model: User,
              attributes: ['id', 'name']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Calculate average rating
    const reviews = movie.Reviews || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const movieData = {
      ...movie.toJSON(),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    };

    res.json(movieData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie', error: error.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const { title, director, description, categoryId, image } = req.body;
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    await movie.update({ title, director, description, categoryId, image });
    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error: error.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Delete image from Cloudinary if it exists
    if (movie.image) {
      try {
        const publicId = movie.image.split('/').pop().split('.')[0];
        // await cloudinary.uploader.destroy(publicId); // This line was removed as per the edit hint
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }
    
    await movie.destroy();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie', error: error.message });
  }
};

// Get similar movies based on year, category, and director
exports.getSimilarMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query; // Default to 6 similar movies
    
    // Get the current movie to find similar ones
    const currentMovie = await Movie.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category']
        }
      ]
    });

    if (!currentMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Build conditions for similar movies
    const whereConditions = [];
    
    // Same category
    if (currentMovie.categoryId) {
      whereConditions.push({ categoryId: currentMovie.categoryId });
    }
    
    // Same release year (within ±2 years)
    if (currentMovie.releaseYear) {
      whereConditions.push({
        releaseYear: {
          [Op.between]: [currentMovie.releaseYear - 2, currentMovie.releaseYear + 2]
        }
      });
    }
    
    // Same director (exact match)
    if (currentMovie.director) {
      whereConditions.push({ director: currentMovie.director });
    }

    // Find similar movies
    const similarMovies = await Movie.findAll({
      where: {
        id: { [Op.ne]: currentMovie.id }, // Exclude the current movie
        [Op.or]: whereConditions
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'category']
        }
      ],
      order: [
        // Prioritize by: same director, same category, same year
        [sequelize.literal(`CASE WHEN director = '${currentMovie.director}' THEN 1 ELSE 0 END`), 'DESC'],
        [sequelize.literal(`CASE WHEN "categoryId" = ${currentMovie.categoryId} THEN 1 ELSE 0 END`), 'DESC'],
        [sequelize.literal(`CASE WHEN "releaseYear" = ${currentMovie.releaseYear} THEN 1 ELSE 0 END`), 'DESC'],
        ['averageRating', 'DESC'] // Then by rating
      ],
      limit: parseInt(limit)
    });

    console.log(`🎬 Found ${similarMovies.length} similar movies for movie ID ${id}`);
    
    res.json({
      message: 'Similar movies found',
      count: similarMovies.length,
      similarMovies
    });
  } catch (error) {
    console.error('❌ Error fetching similar movies:', error);
    res.status(500).json({ message: 'Failed to fetch similar movies', error: error.message });
  }
};
