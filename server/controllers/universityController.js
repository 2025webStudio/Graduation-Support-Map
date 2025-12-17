// 데이터베이스 커넥션 모듈을 불러옵니다.
// `db.query(...)` 형태로 SQL 쿼리를 실행합니다.
const db = require('../config/database');

// 전체 대학교 목록을 반환하는 컨트롤러
// - Method: GET
// - Endpoint: /api/universities
// - 반환: universities 테이블의 모든 행 (JSON 배열)
const getAllUniversities = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM universities ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

// 특정 대학교(학교 id)에 대한 정보를 조회
// - Method: GET
// - Endpoint: /api/universities/:id
// - 파라미터: req.params.id (학교 id)
// - 반환: 해당 학교의 단일 객체 또는 404
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

// 특정 학교에 속한 전시회 목록을 조회
// - Method: GET
// - Endpoint: /api/universities/:id/exhibitions
// - 반환: exhibitions 테이블에서 school_id가 일치하는 행들의 배열
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

// 특정 학교에 달린 댓글(응원 메시지) 목록 조회
// - Method: GET
// - Endpoint: /api/universities/:id/messages
// - 반환: messages 테이블에서 school_id가 일치하는 행들을 created_at 내림차순으로 반환
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

// 특정 학교에 댓글 추가
// - Method: POST
// - Endpoint: /api/universities/:id/messages
// - Request body: { content: string, nickname?: string }
// - 동작: content 검증 후 messages 테이블에 삽입하고 삽입된 레코드를 반환
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

    // 새로 삽입된 메시지를 가져와 전체 데이터(created_at 포함)를 반환
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
