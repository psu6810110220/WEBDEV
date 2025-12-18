import React from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOutlined, 
  AppstoreOutlined, 
  LogoutOutlined,
  DashboardOutlined // ✅ เพิ่ม icon Dashboard
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Content, Footer } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard', // ✅ เพิ่มเมนู Dashboard เป็นอันแรก
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/books',
      icon: <BookOutlined />,
      label: 'Books',
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: 'Categories',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ส่วนหัวด้านบน (Header) */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        
        {/* 1. โลโก้หรือชื่อเว็บด้านซ้าย */}
        <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
            <BookOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} />
            Bookstore
        </div>

        {/* 2. เมนูตรงกลาง (แนวนอน) */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, minWidth: 0 }} 
        />

        {/* 3. ปุ่ม Logout ด้านขวา */}
        <div>
             <Button type="text" danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: '#ff4d4f' }}>
                Logout
             </Button>
        </div>
      </Header>

      {/* ส่วนเนื้อหา (Content) */}
      <Content style={{ padding: '0 48px', marginTop: 24 }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}
        >
          <Outlet />
        </div>
      </Content>

      {/* ส่วนท้าย (Footer) */}
      <Footer style={{ textAlign: 'center' }}>
        Bookstore System ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
}