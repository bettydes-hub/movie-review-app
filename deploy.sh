#!/bin/bash

# Movie Review App Deployment Script
# This script helps deploy both backend and frontend

echo "🚀 Starting Movie Review App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "movie-review-app" ] || [ ! -d "movie-review-frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Backend deployment
print_status "Deploying Backend..."

cd movie-review-app

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    print_warning "Heroku CLI not found. Please install it first:"
    echo "npm install -g heroku"
    echo "heroku login"
    exit 1
fi

# Check if Heroku app exists
if ! heroku apps:info &> /dev/null; then
    print_status "Creating new Heroku app..."
    heroku create
fi

# Add PostgreSQL if not already added
if ! heroku addons:info heroku-postgresql &> /dev/null; then
    print_status "Adding PostgreSQL database..."
    heroku addons:create heroku-postgresql:mini
fi

# Set environment variables
print_status "Setting environment variables..."
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Deploy backend
print_status "Deploying to Heroku..."
git add .
git commit -m "Deploy backend to Heroku" || true
git push heroku main

# Get the backend URL
BACKEND_URL=$(heroku info -s | grep web_url | cut -d= -f2)
print_status "Backend deployed to: $BACKEND_URL"

cd ..

# Frontend deployment
print_status "Deploying Frontend..."

cd movie-review-frontend/movie-review-frontend

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_BASE_URL=$BACKEND_URL/api
EOF

print_status "Created .env.production with backend URL: $BACKEND_URL/api"

# Build frontend
print_status "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend built successfully!"
    print_status "You can now deploy the 'build' folder to your preferred platform:"
    echo "  - Vercel: https://vercel.com"
    echo "  - Netlify: https://netlify.com"
    echo "  - Railway: https://railway.app"
    echo "  - Render: https://render.com"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ../..

print_status "Deployment script completed!"
print_status "Backend URL: $BACKEND_URL"
print_status "Next steps:"
echo "  1. Deploy the frontend build folder to your preferred platform"
echo "  2. Update the FRONTEND_URL in Heroku: heroku config:set FRONTEND_URL=YOUR_FRONTEND_URL"
echo "  3. Test your application" 