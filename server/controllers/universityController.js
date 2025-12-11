const db = require('../config/database');

// 모든 대학교 조회
const getAllUniversities = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM universities ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

// 특정 대학교 조회
const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM universities WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
};

// 대학교별 전시회 조회
const getExhibitionsByUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM exhibitions WHERE school_id = ? ORDER BY start_date',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ error: 'Failed to fetch exhibitions' });
  }
};

module.exports = {
  getAllUniversities,
  getUniversityById,
  getExhibitionsByUniversity
};
