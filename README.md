# Room Design Preview

A modern web application that allows users to visualize wall colors on their room images before painting. Built with React, Vite, and Tailwind CSS.

## Features

### 🎨 Core Functionality
- **Image Upload**: Drag & drop or click to upload room images
- **Color Overlay**: Apply semi-transparent color overlays with adjustable opacity
- **Brush Tool**: Paint specific areas with customizable brush sizes
- **Eraser Tool**: Remove painted areas with precision
- **Real-time Preview**: Instant visual feedback as you make changes
- **High-Quality Export**: Download edited images in PNG format

### 🖥️ User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, glassmorphism-inspired design
- **Intuitive Controls**: Easy-to-use color picker, opacity slider, and brush controls
- **Undo/Redo**: Full history management for all edits
- **Quick Actions**: Reset, download, and mode switching

### 📱 Mobile Optimized
- Touch-friendly brush controls
- Responsive layout (sidebar on desktop, bottom panel on mobile)
- Optimized canvas interactions for touch devices

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Canvas**: HTML5 Canvas API for image manipulation

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd room-design-preview
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your deployment.

### Alternative Deployment Options

- **Netlify**: Drag and drop the `dist` folder to Netlify
- **GitHub Pages**: Use GitHub Actions to deploy the `dist` folder
- **AWS S3**: Upload the `dist` folder to an S3 bucket with static hosting

## Usage Guide

### 1. Upload an Image
- Click "Start Designing" on the home page
- Upload a room image by dragging and dropping or clicking the upload area
- Supported formats: JPG, PNG, WebP (up to 10MB)

### 2. Choose Your Mode
- **Overlay Mode**: Apply color to the entire visible area
- **Brush Mode**: Paint specific areas with precision

### 3. Customize Colors
- Use the color picker or select from preset colors
- Adjust opacity with the slider (1-100%)
- Preview your changes in real-time

### 4. Use Brush Tools (Brush Mode)
- Select brush or eraser tool
- Adjust brush size (1-100px)
- Paint or erase specific areas
- Use undo/redo for corrections

### 5. Export Your Design
- Click the download button to save your edited image
- Images are exported in high-quality PNG format

## Project Structure

```
src/
├── components/
│   ├── BrushControls.jsx    # Brush size and tool controls
│   ├── Canvas.jsx           # Main canvas component with drawing logic
│   ├── ColorControls.jsx    # Color picker and opacity controls
│   └── ImageUpload.jsx      # File upload component
├── pages/
│   ├── EditorPage.jsx       # Main editor interface
│   └── HomePage.jsx         # Landing page with features and pricing
├── App.jsx                  # Main app component with routing
├── index.css               # Global styles and Tailwind imports
└── main.jsx                # React app entry point
```

## Performance Optimizations

- **Canvas Layering**: Separate canvases for base image, overlay, and brush strokes
- **Efficient Rendering**: Only re-render when necessary
- **Image Optimization**: Automatic resizing to optimal canvas dimensions
- **Memory Management**: Proper cleanup of canvas contexts and event listeners

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email hello@roompreview.com or create an issue in the repository.# Chromora
