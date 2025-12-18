import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AddBookScreen from './AddBookScreen';
import EditBookScreen from './EditBookScreen';
import CategoryScreen from './CategoryScreen';
import DashboardScreen from './DashboardScreen'; // ✅ 1. นำเข้าไฟล์ใหม่
import AppLayout from './AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginScreen />} />
      
      {/* เส้นทางที่อยู่ภายใต้ Layout (มีเมนูด้านบน) */}
      <Route element={<AppLayout />}>
        {/* ✅ 2. เพิ่ม Route สำหรับ Dashboard */}
        <Route path="/dashboard" element={<DashboardScreen />} />
        
        <Route path="/books" element={<BookScreen />} />
        <Route path="/books/add" element={<AddBookScreen />} />
        <Route path="/books/edit/:id" element={<EditBookScreen />} />
        <Route path="/categories" element={<CategoryScreen />} />
      </Route>
    </Routes>
  );
}

export default App;