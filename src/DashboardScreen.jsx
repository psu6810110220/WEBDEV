import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

// ลงทะเบียน Component ของ Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const URL_BOOK = "/api/book";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [summary, setSummary] = useState({ totalBooks: 0, totalStock: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(URL_BOOK);
        const books = res.data;

        // 1. คำนวณผลรวม (Statistic)
        const totalStock = books.reduce((sum, book) => sum + (Number(book.stock) || 0), 0);
        setSummary({ totalBooks: books.length, totalStock });

        // 2. เตรียมข้อมูล Pie Chart (แยกตามหมวดหมู่)
        const categoryCount = {};
        books.forEach(book => {
          // เช็คว่า category เป็น object หรือ string (เผื่อ backend ส่งมาต่างกัน)
          const catName = book.category?.name || book.category || 'Uncategorized';
          categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });

        setPieData({
          labels: Object.keys(categoryCount),
          datasets: [
            {
              label: 'จำนวนหนังสือ',
              data: Object.values(categoryCount),
              backgroundColor: [
                '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'
              ],
              borderWidth: 1,
            },
          ],
        });

        // 3. เตรียมข้อมูล Bar Chart (Top 5 สต็อกเยอะสุด)
        const sortedByStock = [...books].sort((a, b) => b.stock - a.stock).slice(0, 5);
        setBarData({
          labels: sortedByStock.map(b => b.title.substring(0, 15) + '...'), // ตัดชื่อให้สั้นหน่อย
          datasets: [
            {
              label: 'Stock Amount',
              data: sortedByStock.map(b => b.stock),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Overview</h2>
      
      {/* ส่วนแสดงตัวเลขสรุป */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic title="Total Books (เล่ม)" value={summary.totalBooks} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Total Stock (ชิ้น)" value={summary.totalStock} />
          </Card>
        </Col>
      </Row>

      {/* ส่วนแสดงกราฟ */}
      <Row gutter={24}>
        <Col xs={24} md={12} style={{ marginBottom: 20 }}>
          <Card title="Books per Category (Pie Chart)">
             <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                {pieData && <Pie data={pieData} />}
             </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top 5 High Stock Books (Bar Chart)">
             <div style={{ height: 300 }}>
                {barData && <Bar data={barData} options={{ maintainAspectRatio: false }} />}
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}