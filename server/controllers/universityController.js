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

// 특정 대학교에 대한 댓글 목록 조회
const getMessagesByUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, nickname, content, created_at FROM messages WHERE school_id = ? ORDER BY created_at DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// 특정 대학교에 댓글 추가 (nickname은 생략 가능 — DB 기본값 '익명' 사용 또는 서버에서 지정)
const postMessage = async (req, res) => {
  try {
    const { id } = req.params; // school id
    const { content, nickname } = req.body;

    if (!content || !content.toString().trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const nick = nickname && nickname.toString().trim() ? nickname : '익명';

    const [result] = await db.query(
      'INSERT INTO messages (nickname, school_id, content) VALUES (?, ?, ?)',
      [nick, id, content]
    );

    // Fetch the newly inserted message to return full data (including created_at)
    const insertId = result.insertId;
    const [rows] = await db.query('SELECT id, nickname, content, created_at FROM messages WHERE id = ?', [insertId]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Failed to post message' });
  }
};

module.exports = {
  getAllUniversities,
  getUniversityById,
  getExhibitionsByUniversity,
  getMessagesByUniversity,
  postMessage
};
