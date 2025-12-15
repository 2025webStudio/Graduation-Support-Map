import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/SchoolDetail.css';

// 이미지 임시 경로
const PLACEHOLDER_IMG = 'https://placehold.co/600x400/png';
const CALENDAR_ICON = 'https://placehold.co/20x20/png?text=C';
const LOCATION_ICON = 'https://placehold.co/20x20/png?text=L';
const ARROW_ICON = 'https://placehold.co/15x10/png?text=%3E';

const SchoolDetail = () => {
  const { id } = useParams();
  const schoolId = id || '1';

  const [school, setSchool] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const [comments, setComments] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [commentInput, setCommentInput] = useState('');
  const [posting, setPosting] = useState(false);

  // Base API URL from Vite env. If not set, default to empty string (relative paths).
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/g, '');
  const apiUrl = (path) => {
    if (!path) return API_BASE;
    if (!API_BASE) return path;
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  };

  useEffect(() => {
    // Fetch school info
    fetch(apiUrl(`/api/universities/${schoolId}`))
      .then((res) => res.json())
      .then((data) => setSchool(data))
      .catch((err) => console.error(err));

    // Fetch exhibitions
    fetch(apiUrl(`/api/universities/${schoolId}/exhibitions`))
      .then((res) => res.json())
      .then((data) => setExhibitions(data))
      .catch((err) => console.error(err));

    // Fetch comments
    fetch(apiUrl(`/api/universities/${schoolId}/messages`))
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, [schoolId]);

  const totalPages = Math.max(1, Math.ceil(exhibitions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exhibitions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePost = async () => {
    if (!commentInput.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(apiUrl(`/api/universities/${schoolId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentInput })
      });
      if (!res.ok) throw new Error('Failed to post');
      const newComment = await res.json();
      // Prepend to comments
      setComments((prev) => [newComment, ...prev]);
      setCommentInput('');
    } catch (e) {
      console.error(e);
      alert('댓글 등록에 실패했습니다. 콘솔을 확인하세요.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="school-detail-container">
      <header className="school-header">
        <div className="school-name-en">{school ? school.name_en || school.name : 'University'}</div>
        <div className="school-name-kr">{school ? school.name : '학교명'}</div>
      </header>

      <section className="exhibition-list">
        {currentItems.map((item) => (
          <article key={item.id} className="exhibition-card">
            <div className="exhibition-img-wrapper">
              <img src={item.poster_url || PLACEHOLDER_IMG} alt={item.department || item.title} className="exhibition-img" />
            </div>
            <div className="exhibition-info">
              <h3 className="dept-name">{item.department || item.title}</h3>

              <div className="info-row">
                <img src={CALENDAR_ICON} alt="Calendar" className="icon" />
                <span>{item.start_date ? `${item.start_date} ~ ${item.end_date || ''}` : ''}</span>
              </div>

              <div className="info-row">
                <img src={LOCATION_ICON} alt="Location" className="icon" />
                <span>{item.venue || item.location}</span>
              </div>

              <p className="description">{item.description}</p>

              {item.website_url ? (
                <a href={item.website_url} className="insta-btn" target="_blank" rel="noopener noreferrer">
                  INSTAGRAM
                  <img src={ARROW_ICON} alt="arrow" className="arrow-icon" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="page-btn"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      <section className="comments-section">
        <h3 className="comments-title">Comments</h3>

        <div className="comment-input-wrapper">
          <input
            type="text"
            className="comment-input"
            placeholder="응원의 메세지를 남겨주세요."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
          />
          <button className="post-btn" onClick={handlePost} disabled={posting || !commentInput.trim()}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>

        <div className="comment-list">
          {comments.length === 0 ? (
            <p style={{ color: '#777' }}>아직 응원 메시지가 없습니다. 첫 응원을 남겨보세요!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.nickname}</span>
                  <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SchoolDetail;