import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/SchoolDetail.css';

// 이 파일은 학교 상세 페이지를 렌더링합니다.
// 주요 기능:
// - 라우트 파라미터(`id`)로 특정 학교 선택
// - 해당 학교의 정보, 전시회 목록, 댓글을 API로부터 조회
// - 전시회는 간단한 페이지네이션으로 표시
// - 사용자 댓글 등록 기능 제공

// 이미지 임시 경로 (실제 이미지가 없을 때 대체로 사용)
const PLACEHOLDER_IMG = 'https://placehold.co/600x400/png';
// 아이콘 임시 URL (개발 중 샘플용)
const CALENDAR_ICON = 'https://placehold.co/20x20/png?text=C';
const LOCATION_ICON = 'https://placehold.co/20x20/png?text=L';

const SchoolDetail = () => {
  const { id } = useParams();
  const schoolId = id || '1';

  // `useParams`로 전달된 id 값을 사용합니다.
  // 라우트에 id가 없으면 안전하게 기본값 '1'을 사용합니다.

  const [school, setSchool] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const [comments, setComments] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const [commentInput, setCommentInput] = useState('');
  const [posting, setPosting] = useState(false);

  // 상태 설명:
  // - school: 현재 선택된 학교 객체 (API 응답)
  // - exhibitions: 해당 학교의 전시회 배열
  // - comments: 해당 학교의 응원 메시지 배열
  // - commentInput: 댓글 입력창 상태
  // - posting: 댓글 전송 중 플래그

  // Base API URL from environment. For Create React App use `REACT_APP_API_URL`.
  // If empty, the app will use relative `/api/...` paths (same-origin).
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/g, '');
  const apiUrl = (path) => {
    if (!path) return API_BASE;
    if (!API_BASE) return path;
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // API URL 헬퍼 함수 설명:
  // - 환경변수(REACT_APP_API_URL)가 설정되어 있으면 그 값을 베이스로 사용
  // - 설정되어 있지 않으면 전달된 경로를 그대로 사용 (동일 오리진)
  // - 이 방식으로 개발/배포 환경에서 동일한 코드로 호출 가능

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

  // useEffect 요약:
  // - 컴포넌트 마운트 또는 `schoolId` 변경 시 세 가지 API를 호출
  //   (학교 정보, 전시회 목록, 댓글 목록)
  // - 네트워크 오류는 콘솔에 출력 (추후 사용자 알림 개선 가능)

  const totalPages = Math.max(1, Math.ceil(exhibitions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = exhibitions.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지네이션 계산
  // - totalPages: 최소 1 페이지 보장
  // - currentItems: 현재 페이지에 보여줄 전시회 항목

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 변경 처리: 단순히 현재 페이지 상태를 변경

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
      setComments((prev) => [newComment, ...prev]);
      setCommentInput('');
    } catch (e) {
      console.error(e);
      alert('댓글 등록에 실패했습니다. 콘솔을 확인하세요.');
    } finally {
      setPosting(false);
    }
  };

  // 댓글 등록 로직 설명:
  // - 입력값이 공백일 경우 동작하지 않음
  // - 서버로 POST 요청을 보내고, 성공하면 응답으로 돌아온 새 댓글을
  //   comments 배열 맨 앞에 추가하여 즉시 UI에 반영
  // - 에러 발생 시 콘솔에 기록하고 간단한 alert로 알림

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
          &lt; Prev
        </button>

        <span className="page-indicator">{currentPage} / {totalPages}</span>

        <button
          className="page-btn"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &gt;
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