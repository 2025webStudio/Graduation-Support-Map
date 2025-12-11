const express = require('express');
const router = express.Router();
const {
  getAllExhibitions,
  getExhibitionById,
  getExhibitionsByDateRange
} = require('../controllers/exhibitionController');

// GET /api/exhibitions - 모든 전시회 조회
router.get('/', getAllExhibitions);

// GET /api/exhibitions/search - 날짜 범위로 전시회 조회
router.get('/search', getExhibitionsByDateRange);

// GET /api/exhibitions/:id - 특정 전시회 조회
router.get('/:id', getExhibitionById);

module.exports = router;
