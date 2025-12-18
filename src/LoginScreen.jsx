import { useState, useEffect } from 'react';
import { Button, Form, Input, Checkbox } from 'antd'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  // 1. เช็คทันทีที่เข้าหน้าเว็บ: "มี Token ค้างไว้ในเครื่องไหม?"
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // ถ้ามี ให้ตั้งค่า axios และข้ามไปหน้า Books เลย
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      navigate('/books');
    }
  }, [navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true)

    // ✅ จำลองการ Login (Mock)
    setTimeout(() => {
        // สร้าง Token ปลอมขึ้นมา
        const mockToken = "mock-token-123456789"; 
        
        // ตั้งค่า Token ใน axios สำหรับใช้ชั่วคราว
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // เช็คว่าติ๊ก Remember me หรือไม่?
        if (formData.remember) {
            // ถ้าติ๊ก -> บันทึกลงเครื่อง (Refresh แล้วไม่ต้องเข้าใหม่)
            localStorage.setItem('token', mockToken);
        } else {
            // ถ้าไม่ติ๊ก -> ไม่บันทึก (หรือลบของเก่าทิ้ง)
            localStorage.removeItem('token');
        }

        setIsLoading(false);
        navigate('/books'); // ไปหน้าทำงาน
    }, 1000); 
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Login Bookstore</h1>
      <Form
        name="login-form"
        onFinish={handleLogin}
        autoComplete="off"
        style={{ width: 300 }}
        initialValues={{ remember: true }} // ติ๊กถูกไว้ให้เลย
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'},]}>
          <Input.Password />
        </Form.Item>

        {/* ปุ่ม Remember Me */}
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          {/* ✅ แก้ไข: เอาคำว่า (Test Mode) ออกแล้วครับ */}
          <Button 
             type="primary" 
             htmlType="submit" 
             loading={isLoading}
             block
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}