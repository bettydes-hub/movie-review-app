# Netlify Deployment Guide

## Overview
This guide explains how to deploy the Movie Review App frontend to Netlify.

## Project Structure
```
project-root/
├── movie-review-app/          # Backend (deployed to Heroku)
├── movie-review-frontend/
│   └── movie-review-frontend/ # Frontend React app
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── build/             # Built files (generated after npm run build)
├── netlify.toml              # Netlify configuration
└── deploy.bat               # Windows deployment script
```

## Netlify Configuration
The `netlify.toml` file is configured with:
- **Base directory**: `.` (repository root)
- **Publish directory**: `movie-review-frontend/movie-review-frontend/build`
- **Build command**: `cd movie-review-frontend/movie-review-frontend && npm install && npm run build`

## Deployment Steps

### 1. Deploy Backend First
Run the deployment script to deploy the backend to Heroku:
```bash
./deploy.bat
```

### 2. Deploy Frontend to Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically use the `netlify.toml` configuration
4. The build process will:
   - Install dependencies in the frontend directory
   - Build the React app
   - Deploy the `build` folder

### 3. Environment Variables
Make sure to set these environment variables in Netlify:
- `REACT_APP_API_BASE_URL`: Your Heroku backend URL (e.g., `https://your-app.herokuapp.com/api`)

## Troubleshooting

### Base Directory Error
If you see "Base directory does not exist: /opt/build":
- Ensure the `netlify.toml` file is in the repository root
- Verify the `base = "."` setting in the configuration
- Make sure the repository structure matches the expected layout

### Build Failures
- Check that all dependencies are properly listed in `package.json`
- Ensure Node.js version compatibility (set to 18 in config)
- Verify the build command works locally first

## Manual Deployment
If automatic deployment fails, you can:
1. Run `npm run build` locally in the frontend directory
2. Upload the `build` folder directly to Netlify
3. Set the publish directory to the uploaded build folder 