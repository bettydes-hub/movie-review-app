const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/db'); // adjust path as needed
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const roleRoutes = require('./routes/roleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Database sync is handled in server.js

const app = express();

// Enable CORS - More permissive for debugging
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json()); // for parsing application/json

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/movie-images', express.static(path.join(__dirname, 'public/movie-images')));

// Test endpoint to verify server is running
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested from:', req.headers.origin || 'unknown');
  console.log('🏥 Request headers:', req.headers);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
  
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000,
    status: 'healthy',
    cors: 'enabled'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.json({ message: 'Test endpoint working!' });
});

// Test image endpoint
app.get('/api/test-images', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const imagePath = path.join(__dirname, 'public/movie-images');
    const files = fs.readdirSync(imagePath);
    
    res.json({ 
      message: 'Images found!', 
      count: files.length,
      images: files,
      imagePath: imagePath,
      testUrl: 'http://localhost:3000/movie-images/the_shawshank.jpeg'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error reading images', 
      error: error.message,
      currentDir: __dirname
    });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categories', categoryRoutes);

// Test categories endpoint
app.get('/api/test-categories', async (req, res) => {
  try {
    const Category = require('./models/category');
    const categories = await Category.findAll();
    console.log('📂 Categories found:', categories.length);
    res.json({ 
      message: 'Categories retrieved successfully', 
      count: categories.length,
      categories: categories
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to get categories', error: error.message });
  }
});

// Test endpoints for debugging
app.get('/api/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

app.get('/api/test-users', async (req, res) => {
  try {
    const User = require('./models/user');
    const Role = require('./models/role');
    
    const users = await User.findAll({
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });
    
    res.json({ 
      message: 'Users retrieved successfully', 
      count: users.length,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.Role?.name
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});



app.post('/api/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test login attempt:', { email, password });
    
    const User = require('./models/user');
    const Role = require('./models/role');
    
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Role,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User found',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role?.name,
        hasPassword: !!user.password
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Test login failed', error: error.message });
  }
});

// ... your other app setup

module.exports = app;
