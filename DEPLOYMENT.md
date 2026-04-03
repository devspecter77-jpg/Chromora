# Chromora - Deployment Guide (Railway & Render)

## Deployment Status
✅ **Ready for Railway & Render Deployment**

## Render Deployment (Current Issue Fixed)
The "Blocked request" error occurs when Render tries to use Vite's preview server instead of our Express server.

### Render Configuration
**Build Command:** `npm ci && npm run build`
**Start Command:** `node server.js`

### Render Settings (Manual Configuration)
1. Go to your Render dashboard
2. Select your Chromora service
3. Go to Settings
4. Set **Build Command:** `npm ci && npm run build`
5. Set **Start Command:** `node server.js`
6. Set **Environment:** `Node`
7. Add Environment Variable: `NODE_ENV=production`

### Alternative Render Configuration
If manual settings don't work, use the `render.yaml` file in the repository root.

## Latest Fixes (Healthcheck & Host Issues)
1. **Express Server**: Proper production server that handles all requests
2. **Host Configuration**: Added allowed hosts for Render domain
3. **Render Config**: Created `render.yaml` for explicit configuration
4. **Debug Logging**: Added server startup logs for troubleshooting
5. **Multiple Start Options**: Added `serve` script as alternative

## What Was Fixed
1. **Build Dependencies**: All build tools in `dependencies`
2. **Server Configuration**: Express.js server (`server.js`)
3. **Host Restrictions**: Added `chromora.onrender.com` to allowed hosts
4. **Port Configuration**: Proper PORT environment variable handling
5. **Health Monitoring**: `/health` endpoint for monitoring

## Deployment Files
- `package.json` - Updated with Express and proper scripts
- `server.js` - Express.js production server with debugging
- `render.yaml` - Render deployment configuration
- `start.sh` - Alternative startup script
- `vite.config.js` - Updated with allowed hosts
- `railway.toml` - Railway deployment settings (if switching)
- `nixpacks.toml` - Railway build configuration (if switching)

## Server Endpoints
- `/` - Main application (React SPA)
- `/health` - Health check endpoint (returns JSON status)
- All other routes serve the React application (client-side routing)

## Environment Variables
Render will set:
- `PORT` - Dynamic port assignment
- `NODE_ENV=production` - Set manually or via render.yaml

## Build Process
Render will:
1. Install dependencies with `npm ci`
2. Build the React application with `npm run build`
3. Start the Express server with `node server.js`

## Local Testing
To test the production build locally:
```bash
npm run build
node server.js
```
Then visit `http://localhost:3000`

## Troubleshooting Render Issues
1. **Check Build Logs**: Look for build command execution
2. **Check Start Command**: Ensure it's `node server.js` not `npm start`
3. **Verify Build Output**: Check that `dist/` folder is created
4. **Test Health Endpoint**: Visit `/health` to verify Express server
5. **Check Environment**: Ensure `NODE_ENV=production` is set

## Railway Deployment (Alternative)
If you prefer Railway:
1. Push to GitHub
2. Connect to Railway
3. Railway will auto-detect configuration

## Application Features
- ✅ Responsive design (mobile + desktop)
- ✅ Camera capture for real-time wall painting
- ✅ Image upload for static wall painting
- ✅ Interactive brush/eraser tools
- ✅ Color picker with opacity control
- ✅ Uzbek language localization
- ✅ Chromora branding with purple-blue gradient
- ✅ Manual wall selection and painting
- ✅ Production Express.js server
- ✅ Health monitoring endpoint
- ✅ Render & Railway compatibility