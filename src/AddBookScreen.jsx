import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, InputNumber } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function AddBookScreen() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ดึงข้อมูลหมวดหมู่มาใส่ใน Dropdown
  useEffect(() => {
    axios.get(URL_CATEGORY).then(res => {
      setCategories(res.data.map(c => ({ label: c.name, value: c.id })));
    }).catch(err => console.error(err));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // แปลงค่าให้เป็นตัวเลขก่อนส่ง
      const payload = {
          ...values,
          price: Number(values.price),
          stock: Number(values.stock)
      };

      await axios.post(URL_BOOK, payload);
      message.success("เพิ่มหนังสือเรียบร้อย!");
      navigate('/books'); // บันทึกเสร็จ กลับไปหน้ารายการ
    } catch (err) {
      console.error(err);
      message.error("เพิ่มไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>เพิ่มหนังสือเล่มใหม่</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'กรุณาใส่ชื่อเรื่อง' }]}>
          <Input placeholder="ชื่อหนังสือ" />
        </Form.Item>
        
        <Form.Item label="Author" name="author" rules={[{ required: true }]}>
          <Input placeholder="ชื่อผู้แต่ง" />
        </Form.Item>

        <Form.Item label="Category" name="category_id">
             <Select placeholder="เลือกหมวดหมู่" options={categories} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 10 }}>
            <Form.Item label="Price" name="price" rules={[{ required: true }]} style={{ flex: 1 }}>
                <Input type="number" step="0.01" prefix="$" />
            </Form.Item>
            <Form.Item label="Stock" name="stock" rules={[{ required: true }]} style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
        </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => navigate('/books')}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" loading={loading}>บันทึกข้อมูล</Button>
         </div>
      </Form>
    </div>
  );
}