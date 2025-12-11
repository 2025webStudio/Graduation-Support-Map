const express = require('express');
const router = express.Router();
const {
  getAllUniversities,
  getUniversityById,
  getExhibitionsByUniversity
} = require('../controllers/universityController');

// GET /api/universities - 모든 대학교 조회
router.get('/', getAllUniversities);

// GET /api/universities/:id - 특정 대학교 조회
router.get('/:id', getUniversityById);

// GET /api/universities/:id/exhibitions - 대학교별 전시회 조회
router.get('/:id/exhibitions', getExhibitionsByUniversity);

module.exports = router;


