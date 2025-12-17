import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';

function CalendarPage() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExhibitions, setSelectedExhibitions] = useState([]);

  // Base API URL from environment variable
  const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/g, '');
  const apiUrl = (path) => {
    if (!path) return API_BASE;
    if (!API_BASE) return path;
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // API에서 전시회 데이터 가져오기
  useEffect(() => {
    fetch(apiUrl('/api/exhibitions'))
      .then(res => res.json())
      .then(data => {
        setExhibitions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch exhibitions:', err);
        setLoading(false);
      });
  }, []);

  // 특정 날짜의 전시회 가져오기
  const getExhibitionsByDate = (checkDate) => {
    return exhibitions.filter(exhibition => {
      const start = new Date(exhibition.start_date);
      const end = new Date(exhibition.end_date);
      const check = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return check >= startDate && check <= endDate;
    });
  };

  // 날짜에 전시회가 있는지 확인
  const hasExhibition = (checkDate) => {
    return getExhibitionsByDate(checkDate).length > 0;
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const exhibitions = getExhibitionsByDate(date);
    setSelectedExhibitions(exhibitions);
  };

  // 초기 로드 시 오늘 날짜의 전시회 표시
  useEffect(() => {
    const todayExhibitions = getExhibitionsByDate(new Date());
    setSelectedExhibitions(todayExhibitions);
  }, [exhibitions]);

  // 캘린더 타일에 커스텀 내용 추가
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasExhibition(date)) {
      return (
        <div className="exhibition-indicator">
          <div className="exhibition-dot"></div>
        </div>
      );
    }
    return null;
  };

  // 캘린더 타일에 클래스 추가
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && hasExhibition(date)) {
      return 'has-exhibition';
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-wrapper">
          <Calendar
            value={selectedDate}
            onChange={handleDateClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="en-US"
            formatDay={(locale, date) => date.getDate()}
            minDetail="month"
            maxDetail="month"
            navigationLabel={({ date }) =>
              date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            }
            showNeighboringMonth={false}
            showNavigation={true}
          />
        </div>

        <div className="exhibition-list">
          <h2 className="selected-date">
            {selectedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>

          {selectedExhibitions.length > 0 ? (
            <div className="exhibitions-grid">
              {selectedExhibitions.map(exhibition => (
                <div key={exhibition.id} className="exhibition-card">
                  <div className="exhibition-poster">
                    <img
                      src={exhibition.poster_url}
                      alt={exhibition.title}
                    />
                  </div>
                  <div className="exhibition-info">
                    <h3 className="exhibition-title">{exhibition.title}</h3>
                    <p className="exhibition-university">
                      {exhibition.university_name}
                    </p>
                    <p className="exhibition-department">
                      {exhibition.department}
                    </p>
                    <p className="exhibition-venue">
                      {exhibition.venue}
                    </p>
                    <p className="exhibition-date">
                      {new Date(exhibition.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' - '}
                      {new Date(exhibition.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {exhibition.website_url && (
                      <a
                        href={exhibition.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exhibition-link"
                      >
                        View More →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-exhibitions">
              <p>No exhibitions on this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
