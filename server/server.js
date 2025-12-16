const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const universityRoutes = require('./routes/universities');
const exhibitionRoutes = require('./routes/exhibitions');

app.use('/api/universities', universityRoutes);
app.use('/api/exhibitions', exhibitionRoutes);

//학교별 전시회 대표 이미지 불러와서 3000에 던져주기
app.use(
    "/images",
    express.static(path.join(__dirname,"images"))
)

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
