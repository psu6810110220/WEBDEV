import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios' // ✅ 1. เพิ่มบรรทัดนี้: นำเข้า axios

// ✅ 2. เพิ่มบรรทัดนี้: บอก axios ว่า Backend ของเราอยู่ที่ไหน
axios.defaults.baseURL = "http://localhost:3000"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)