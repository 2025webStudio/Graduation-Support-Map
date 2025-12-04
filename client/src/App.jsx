import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 페이지들 불러오기
import Home from './pages/Home.jsx';
import Calendar from './pages/Calendar.jsx';
import SchoolDetail from './pages/SchoolDetail.jsx';

// 공통 컴포넌트
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar는 어떤 페이지든 항상 위에 보임 */}
      <Navbar /> 
      
      <Routes>
        {/* 주소별로 보여줄 페이지 설정 */}
        <Route path="/" element={<Home />} />               {/* 메인 */}
        <Route path="/calendar" element={<Calendar />} />   {/* 달력 */}
        {/* :id는 학교마다 다른 번호를 받기 위함 (예: /school/1) */}
        <Route path="/school/:id" element={<SchoolDetail />} /> 
      </Routes>

      {/* Footer도 항상 아래에 보임 */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;