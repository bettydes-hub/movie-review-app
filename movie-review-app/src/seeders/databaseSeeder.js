// src/seeders/databaseSeeder.js
const bcrypt = require('bcrypt');
const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Movie = require('../models/movie');
const Review = require('../models/review');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const existingRoles = await Role.count();
    if (existingRoles > 0) {
      console.log('📊 Database already has data, skipping seeding...');
      return;
    }

    // 1. Create Roles
    console.log('Creating roles...');
    const adminRole = await Role.create({ name: 'Admin' });
    const userRole = await Role.create({ name: 'User' });
    console.log('✅ Roles created');

    // 2. Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@movieapp.com',
      password: hashedPassword,
      roleId: adminRole.id
    });
    console.log('✅ Admin user created');

    // 3. Create Regular Users
    console.log('Creating regular users...');
    const userPassword = await bcrypt.hash('user123', 10);
    const users = await User.bulkCreate([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        roleId: userRole.id
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        roleId: userRole.id
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: userPassword,
        roleId: userRole.id
      }
    ]);
    console.log('✅ Regular users created');

    // 4. Create Movie Categories
    console.log('Creating movie categories...');
    const categories = await Category.bulkCreate([
      { category: 'Action' },
      { category: 'Drama' },
      { category: 'Comedy' },
      { category: 'Sci-Fi' },
      { category: 'Horror' },
      { category: 'Romance' },
      { category: 'Thriller' },
      { category: 'Adventure' },
      { category: 'Documentary' },
      { category: 'Animation' },
      { category: 'Crime' }
    ]);
    console.log('✅ Categories created');

    // 5. Create Movies
    console.log('Creating movies...');
    
    // Debug: Log categories to see what's available
    console.log('Available categories:', categories.map(c => ({ id: c.id, category: c.category })));
    
    const movies = await Movie.bulkCreate([
      {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        categoryId: categories.find(c => c.category === 'Drama')?.id || categories[0].id,
        image: '/movie-images/the_shawshank.jpeg'
      },
      {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        categoryId: categories.find(c => c.category === 'Drama')?.id || categories[0].id,
        image: '/movie-images/the_godFather.jpeg'
      },
      {
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        categoryId: categories.find(c => c.category === 'Action')?.id || categories[0].id,
        image: '/movie-images/the_dark_knight.jpeg'
      },
      {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        categoryId: categories.find(c => c.category === 'Crime')?.id || categories[0].id,
        image: '/movie-images/Pulp_Fiction.jpeg'
      },
      {
        title: 'Fight Club',
        director: 'David Fincher',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
        categoryId: categories.find(c => c.category === 'Drama')?.id || categories[0].id,
        image: '/movie-images/Fight_Club.jpeg'
      },
      {
        title: 'Inception',
        director: 'Christopher Nolan',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        categoryId: categories.find(c => c.category === 'Sci-Fi')?.id || categories[0].id,
        image: '/movie-images/Inception.jpeg'
      },
      {
        title: 'The Matrix',
        director: 'Lana Wachowski',
        description: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
        categoryId: categories.find(c => c.category === 'Sci-Fi')?.id || categories[0].id,
        image: '/movie-images/The Matrix.jpeg'
      },
      {
        title: 'Goodfellas',
        director: 'Martin Scorsese',
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
        categoryId: categories.find(c => c.category === 'Crime')?.id || categories[0].id,
        image: '/movie-images/Goodfellas.jpeg'
      },
      {
        title: 'The Silence of the Lambs',
        director: 'Jonathan Demme',
        description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
        categoryId: categories.find(c => c.category === 'Thriller')?.id || categories[0].id,
        image: '/movie-images/The Silence of the Lambs.jpeg'
      },
      {
        title: 'Interstellar',
        director: 'Christopher Nolan',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        categoryId: categories.find(c => c.category === 'Sci-Fi')?.id || categories[0].id,
        image: '/movie-images/Interstellar.jpeg'
      }
    ]);
    console.log('✅ Movies created');

    // 6. Create Reviews
    console.log('Creating reviews...');
    
    // Debug: Log users and movies to see what's available
    console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
    console.log('Available movies:', movies.map(m => ({ id: m.id, title: m.title })));
    
    const reviews = await Review.bulkCreate([
      {
        user_id: users.find(u => u.email === 'admin@movieapp.com')?.id || users[0].id,
        movie_id: movies.find(m => m.title === 'The Shawshank Redemption')?.id || movies[0].id,
        rating: 5,
        comment: 'An absolute masterpiece! The story of hope and redemption is beautifully told. Tim Robbins and Morgan Freeman deliver outstanding performances.'
      },
      {
        user_id: users.find(u => u.email === 'john@example.com')?.id || users[0].id,
        movie_id: movies.find(m => m.title === 'The Shawshank Redemption')?.id || movies[0].id,
        rating: 4,
        comment: 'Great movie with powerful themes. The friendship between Andy and Red is heartwarming.'
      },
      {
        user_id: users.find(u => u.email === 'admin@movieapp.com')?.id || users[0].id,
        movie_id: movies.find(m => m.title === 'The Dark Knight')?.id || movies[0].id,
        rating: 5,
        comment: 'Heath Ledger\'s Joker is one of the greatest performances in cinema history. Christopher Nolan created a masterpiece.'
      },
      {
        user_id: users.find(u => u.email === 'john@example.com')?.id || users[0].id,
        movie_id: movies.find(m => m.title === 'Inception')?.id || movies[0].id,
        rating: 4,
        comment: 'Mind-bending concept executed brilliantly. The visual effects are stunning and the story keeps you guessing.'
      },
      {
        user_id: users.find(u => u.email === 'admin@movieapp.com')?.id || users[0].id,
        movie_id: movies.find(m => m.title === 'Pulp Fiction')?.id || movies[0].id,
        rating: 5,
        comment: 'Quentin Tarantino at his best! The non-linear storytelling and memorable dialogue make this a classic.'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${users.length} users, ${categories.length} categories, ${movies.length} movies, and ${reviews.length} reviews`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase; 