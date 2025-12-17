// 데이터베이스 연결 모듈 불러오기
const db = require('../config/database');

// 전체 전시회 목록 조회
// - Method: GET
// - Endpoint: /api/exhibitions
// - 반환: exhibitions 테이블과 관련 대학 정보를 조인하여 반환
const getAllExhibitions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, u.name as university_name, u.name_en as university_name_en, u.district
      FROM exhibitions e
      LEFT JOIN universities u ON e.school_id = u.id
      ORDER BY e.start_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ error: 'Failed to fetch exhibitions' });
  }
};

// 특정 전시회(id 기준) 조회
// - Method: GET
// - Endpoint: /api/exhibitions/:id
// - 반환: 전시회 단일 객체(관련 대학 정보 포함)
const getExhibitionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT e.*, u.name as university_name, u.name_en as university_name_en, u.district
      FROM exhibitions e
      LEFT JOIN universities u ON e.school_id = u.id
      WHERE e.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    res.status(500).json({ error: 'Failed to fetch exhibition' });
  }
};

// 날짜 범위로 전시회 조회
// - Method: GET
// - Endpoint: /api/exhibitions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// - 동작: 전달된 startDate/endDate에 따라 WHERE 절을 동적으로 생성
const getExhibitionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT e.*, u.name as university_name, u.name_en as university_name_en, u.district
      FROM exhibitions e
      LEFT JOIN universities u ON e.school_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += ' AND e.start_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND e.end_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY e.start_date';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching exhibitions by date:', error);
    res.status(500).json({ error: 'Failed to fetch exhibitions' });
  }
};

module.exports = {
  getAllExhibitions,
  getExhibitionById,
  getExhibitionsByDateRange
};
