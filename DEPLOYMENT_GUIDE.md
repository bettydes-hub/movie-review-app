# Movie Review App Deployment Guide

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Backend Deployment:
1. **Install Heroku CLI** and login:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app**:
   ```bash
   cd movie-review-app
   heroku create your-movie-app-backend
   ```

3. **Add PostgreSQL database**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Frontend Deployment (Vercel):
1. **Build the frontend**:
   ```bash
   cd movie-review-frontend/movie-review-frontend
   npm run build
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.herokuapp.com`

### Option 2: Railway (Modern Alternative)

#### Backend:
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `movie-review-app` folder
4. Add PostgreSQL database from Railway dashboard
5. Set environment variables in Railway dashboard

#### Frontend:
1. Create new Railway project
2. Select the `movie-review-frontend/movie-review-frontend` folder
3. Set build command: `npm run build`
4. Set start command: `npx serve -s build -l 3000`

### Option 3: Render (Full-Stack)

#### Backend:
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Select the `movie-review-app` folder
5. Add PostgreSQL database from Render dashboard
6. Set environment variables

#### Frontend:
1. Create new Static Site
2. Connect your GitHub repository
3. Select the `movie-review-frontend/movie-review-frontend` folder
4. Set build command: `npm run build`
5. Set publish directory: `build`

## 🔧 Environment Variables

### Backend (.env):
```env
# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env):
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 📋 Pre-Deployment Checklist

- [ ] Update API URLs in frontend to use environment variables
- [ ] Set up production database
- [ ] Configure CORS for production domains
- [ ] Set secure JWT secret
- [ ] Test build process locally
- [ ] Ensure all environment variables are set
- [ ] Test API endpoints with production database

## 🐛 Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly
2. **Database Connection**: Verify database credentials and connection string
3. **Build Failures**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required variables are set in deployment platform

## 🔗 Useful Commands

```bash
# Test build locally
cd movie-review-app && npm run build

# Test frontend build
cd movie-review-frontend/movie-review-frontend && npm run build

# Check environment variables
heroku config  # For Heroku
railway variables  # For Railway
```

## 📞 Support

If you encounter issues during deployment, check:
1. Platform-specific logs
2. Environment variable configuration
3. Database connection settings
4. CORS configuration 