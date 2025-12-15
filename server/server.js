const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS: if FRONTEND_URL is set, restrict to that origin(s), else allow all.
const FRONTEND_URL = process.env.FRONTEND_URL;
if (FRONTEND_URL) {
  const allowedOrigins = FRONTEND_URL.split(',').map((s) => s.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser requests like curl/postman (no origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
      }
    })
  );
  console.log('CORS restricted to:', allowedOrigins);
} else {
  app.use(cors());
  console.log('CORS: allowing all origins (FRONTEND_URL not set)');
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const universityRoutes = require('./routes/universities');
const exhibitionRoutes = require('./routes/exhibitions');

app.use('/api/universities', universityRoutes);
app.use('/api/exhibitions', exhibitionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Graduation Support Map API',
    version: '1.0.0',
    endpoints: {
      universities: '/api/universities',
      exhibitions: '/api/exhibitions',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
