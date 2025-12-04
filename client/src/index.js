import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // 아까 만든 CSS 파일을 여기서 불러옵니다.

// 1. HTML 파일에서 id가 'root'인 요소를 찾습니다.
const rootElement = document.getElementById('root');

// 2. 그 요소 안에 리액트 앱(App)을 그려줍니다(Render).
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)