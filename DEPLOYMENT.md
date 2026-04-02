# Chromora - Railway Deployment Guide

## Deployment Status
✅ **Ready for Railway Deployment**

## What Was Fixed
1. **Build Dependencies**: Moved all build tools from `devDependencies` to `dependencies` to ensure Railway can access them during build
2. **Port Configuration**: Fixed port handling for Railway's dynamic PORT environment variable
3. **Build Configuration**: Updated Vite config to use `esbuild` minification for better compatibility
4. **Added Terser**: Included terser dependency for production builds

## Deployment Files
- `package.json` - Updated with all dependencies and proper scripts
- `nixpacks.toml` - Railway build configuration
- `railway.toml` - Railway deployment settings
- `Dockerfile` - Alternative Docker configuration
- `vite.config.js` - Production-ready Vite configuration

## Railway Deployment Steps
1. **Push to GitHub**: Make sure your code is pushed to your GitHub repository
2. **Connect to Railway**: 
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the Chromora project
3. **Deploy**: Railway will automatically detect the configuration and deploy

## Environment Variables
Railway will automatically set:
- `PORT` - Dynamic port assignment
- `NODE_ENV=production` - Set via nixpacks.toml

## Build Process
Railway will:
1. Install dependencies with `npm ci`
2. Build the application with `npm run build`
3. Start the server with `npm start`

## Local Testing
To test the production build locally:
```bash
npm run build
npm run preview
```

## Troubleshooting
If deployment fails:
1. Check Railway logs for specific errors
2. Ensure all dependencies are in `dependencies` (not `devDependencies`)
3. Verify the build works locally with `npm run build`

## Application Features
- ✅ Responsive design (mobile + desktop)
- ✅ Camera capture for real-time wall painting
- ✅ Image upload for static wall painting
- ✅ Interactive brush/eraser tools
- ✅ Color picker with opacity control
- ✅ Uzbek language localization
- ✅ Chromora branding with purple-blue gradient
- ✅ Manual wall selection and painting