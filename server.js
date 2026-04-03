import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting Chromora Express Server...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV);
console.log('Dist directory:', join(__dirname, 'dist'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Express',
    port: port
  });
});

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  console.log('Serving index.html for route:', req.path);
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Chromora server running on port ${port}`);
  console.log(`🌐 Server accessible at http://0.0.0.0:${port}`);
});