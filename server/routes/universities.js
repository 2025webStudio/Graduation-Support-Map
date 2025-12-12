const express = require('express');
const router = express.Router();
const {
  getAllUniversities,
  getUniversityById,
  getExhibitionsByUniversity,
  getMessagesByUniversity,
  postMessage
} = require('../controllers/universityController');

// GET /api/universities - 모든 대학교 조회
router.get('/', getAllUniversities);

// GET /api/universities/:id - 특정 대학교 조회
router.get('/:id', getUniversityById);

// GET /api/universities/:id/exhibitions - 대학교별 전시회 조회
router.get('/:id/exhibitions', getExhibitionsByUniversity);

// GET /api/universities/:id/messages - 해당 학교의 댓글 목록
router.get('/:id/messages', getMessagesByUniversity);

// POST /api/universities/:id/messages - 해당 학교에 댓글 추가
router.post('/:id/messages', postMessage);

module.exports = router;


