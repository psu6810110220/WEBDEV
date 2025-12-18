import { useState, useEffect } from 'react';
import { Table, Button, Form, Input, message, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_CATEGORY = "/api/book-category";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL_CATEGORY);
      // เรียงลำดับตาม ID (ใหม่สุดอยู่ล่าง หรือจะแก้เป็น b.id - a.id ก็ได้)
      setCategories(res.data.sort((a, b) => a.id - b.id));
    } catch (err) {
      message.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ฟังก์ชันเพิ่มหมวดหมู่
  const handleAdd = async (values) => {
    try {
      await axios.post(URL_CATEGORY, values);
      message.success("เพิ่มหมวดหมู่สำเร็จ!");
      form.resetFields(); // ล้างช่องกรอก
      fetchCategories();  // โหลดตารางใหม่
    } catch (err) {
      message.error("เพิ่มไม่สำเร็จ");
    }
  };

  // ฟังก์ชันลบหมวดหมู่
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?',
      onOk: async () => {
        try {
          await axios.delete(`${URL_CATEGORY}/${id}`);
          message.success("ลบเรียบร้อย");
          fetchCategories();
        } catch (err) {
          message.error("ลบไม่สำเร็จ (อาจมีหนังสือใช้งานหมวดหมู่นี้อยู่)");
        }
      }
    });
  };

  // ตั้งค่าคอลัมน์ในตาราง
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Category Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Manage Categories</h2>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
      </div>

      {/* โซนเพิ่มข้อมูล */}
      <div style={{ marginBottom: 20, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
        <Form layout="inline" form={form} onFinish={handleAdd}>
          <Form.Item name="name" label="New Category" rules={[{ required: true, message: 'กรุณาใส่ชื่อ' }]}>
            <Input placeholder="ชื่อหมวดหมู่..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
}