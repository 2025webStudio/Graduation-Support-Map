import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // 아까 만든 CSS 파일을 여기서 불러옵니다.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {}
  </React.StrictMode>,
)