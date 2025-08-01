# 🎬 Movie Review Application

A full-stack movie review platform built with Node.js, Express, PostgreSQL, and React. Users can browse movies, read reviews, and submit their own ratings and comments. Admins can manage movies, categories, and users.

## ✨ Features

### 🎯 Core Features
- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/User)

- **Movie Management**
  - Browse movies with search and filtering
  - Movie details with reviews and ratings
  - Admin can add, edit, and delete movies
  - Movie categories and images

- **Review System**
  - Users can rate movies (1-5 stars)
  - Write detailed reviews and comments
  - View all reviews for each movie
  - Average rating calculations

- **Admin Dashboard**
  - Manage movies and categories
  - User management
  - Review moderation
  - Analytics and statistics

### 🔧 Technical Features
- **Backend API**
  - RESTful API with Express.js
  - PostgreSQL database with Sequelize ORM
  - JWT authentication middleware
  - Input validation and error handling
  - Search, filtering, and pagination

- **Frontend**
  - Modern React application
  - Responsive design with Tailwind CSS
  - Protected routes and role-based UI
  - Real-time updates and notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Clone and Install Dependencies**
   ```bash
   cd movie-review-app
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb movie_review_db
   
   # Copy environment file
   cp env.example .env
   
   # Update .env with your database credentials
   ```

3. **Environment Configuration**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=movie_review_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=3000
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

   The server will automatically:
   - Connect to the database
   - Create all tables
   - Seed the database with sample data
   - Start on http://localhost:3000

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd movie-review-frontend
   npm install
   ```

2. **Start the Frontend**
   ```bash
   npm start
   ```

   The React app will start on http://localhost:3001

## 📊 Sample Data

The application comes pre-loaded with:

- **10 Movie Categories**: Action, Drama, Comedy, Sci-Fi, Horror, Romance, Thriller, Adventure, Documentary, Animation, Crime
- **10 Popular Movies**: The Shawshank Redemption, The Godfather, The Dark Knight, Pulp Fiction, Fight Club, Inception, The Matrix, Goodfellas, The Silence of the Lambs, Interstellar
- **3 Regular Users**: john@example.com, jane@example.com, mike@example.com
- **1 Admin User**: admin@movieapp.com
- **10 Sample Reviews**: Realistic reviews for the movies

### Default Login Credentials

**Admin Account:**
- Email: `admin@movieapp.com`
- Password: `admin123`

**User Accounts:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`
- Email: `mike@example.com` | Password: `user123`

## 🛠️ API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Movies
- `GET /api/movies` - Get all movies (with search, filtering, pagination)
- `GET /api/movies/:id` - Get movie details with reviews
- `POST /api/movies` - Create new movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review (authenticated users)
- `PUT /api/reviews/:id` - Update review (owner only)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## 🎨 Frontend Features

### User Interface
- **Homepage**: Featured movies and categories
- **Movie List**: Browse all movies with search and filters
- **Movie Details**: Full movie information with reviews
- **User Profile**: Personal information and review history
- **Admin Dashboard**: Movie and user management

### User Experience
- Responsive design for all devices
- Real-time search and filtering
- Smooth navigation and transitions
- Toast notifications for user feedback
- Loading states and error handling

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Protected API endpoints

## 📈 Business Value

### For Users
- Discover new movies through reviews
- Share opinions and read others' perspectives
- Track personal movie history
- Find movies by genre and rating

### For Admins
- Complete movie catalog management
- User engagement analytics
- Content moderation tools
- Platform growth insights

### For Business
- Scalable architecture for growth
- User engagement and retention
- Data-driven movie recommendations
- Monetization opportunities

## 🚀 Deployment Ready

The application is production-ready with:
- Environment configuration
- Database migrations
- Error handling and logging
- Security best practices
- Scalable architecture

## 📝 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Project Structure
```
movie-review-app/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Authentication & validation
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeding
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md          # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready for Production Deployment! 🚀**

This application demonstrates modern web development practices with a focus on user experience, security, and scalability. Perfect for presenting to stakeholders and managers. 