const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
// FRONTEND_URL 환경변수가 설정되어 있으면 CORS를 제한된 오리진으로 설정
// - 변수는 쉼표(,)로 여러 오리진을 받을 수 있음
// - 브라우저에서 오는 요청(origin)이 비어있을 경우(서버-to-server 요청 등)는 허용
const FRONTEND_URL = process.env.FRONTEND_URL;
if (FRONTEND_URL) {
  const allowedOrigins = FRONTEND_URL.split(',').map((s) => s.trim());
  app.use(
    cors({
      origin: (origin, callback) => {        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
      }
    })
  );
  console.log('CORS restricted to:', allowedOrigins);
} else {
  // FRONTEND_URL이 설정되지 않으면 모든 오리진 허용 (개발 편의성)
  app.use(cors());
  console.log('CORS: allowing all origins (FRONTEND_URL not set)');
}
// JSON 바디 파싱 및 URL 인코딩된 폼 데이터 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 등록
// - `routes/universities`와 `routes/exhibitions`가 각각 리소스 라우트를 정의
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

// middleware 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});