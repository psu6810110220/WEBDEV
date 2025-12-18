import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Spin, InputNumber } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function EditBookScreen() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm(); // ใช้สำหรับจัดการ Form
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง ID จาก URL (เช่น /books/edit/1)

  useEffect(() => {
    // 1. ดึงหมวดหมู่
    axios.get(URL_CATEGORY).then(res => {
      setCategories(res.data.map(c => ({ label: c.name, value: c.id })));
    });

    // 2. ดึงข้อมูลหนังสือเล่มที่จะแก้
    setLoading(true);
    axios.get(`${URL_BOOK}/${id}`).then(res => {
        // เอาข้อมูลที่ได้มาใส่ลงใน Form
        form.setFieldsValue(res.data);
    }).catch(err => {
        message.error("หาหนังสือไม่เจอ");
        navigate('/books');
    }).finally(() => setLoading(false));

  }, [id, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
          ...values,
          price: Number(values.price),
          stock: Number(values.stock)
      };
      
      // ลบ field ที่ไม่ควรส่งไป
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      await axios.patch(`${URL_BOOK}/${id}`, payload);
      message.success("แก้ไขเรียบร้อย!");
      navigate('/books');
    } catch (err) {
      console.error(err);
      message.error("แก้ไขไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categories.length) return <Spin style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>แก้ไขข้อมูลหนังสือ (ID: {id})</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Author" name="author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Category" name="category_id">
             <Select options={categories} />
        </Form.Item>
        <div style={{ display: 'flex', gap: 10 }}>
            <Form.Item label="Price" name="price" rules={[{ required: true }]} style={{ flex: 1 }}>
                <Input type="number" step="0.01" />
            </Form.Item>
            <Form.Item label="Stock" name="stock" rules={[{ required: true }]} style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
        </div>
         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => navigate('/books')}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" loading={loading}>บันทึกการแก้ไข</Button>
         </div>
      </Form>
    </div>
  );
}