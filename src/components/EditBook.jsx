// components/EditBookModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

function EditBookModal({ open, onCancel, onSave, book }) {
  // สร้าง State สำหรับเก็บข้อมูลในฟอร์มแก้ไขแยกต่างหาก
  const [formData, setFormData] = useState(null);

  // เมื่อ Modal ถูกเปิด หรือข้อมูลหนังสือเปลี่ยน ให้ดึงข้อมูลมาใส่ใน Form
  useEffect(() => {
    if (book) {
      setFormData({ ...book });
    }
  }, [book, open]);

  // ฟังก์ชันจัดการเมื่อพิมพ์แก้ข้อมูล
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // เมื่อกด OK ให้ส่งข้อมูลกลับไปที่ App.jsx
  const handleOk = () => {
    onSave(formData);
  };

  return (
    <Modal 
      title="แก้ไขข้อมูลหนังสือ" 
      open={open} 
      onOk={handleOk} 
      onCancel={onCancel}
    >
      {formData && (
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
            />
          </Form.Item>
          <Form.Item label="Author">
            <Input 
              value={formData.author} 
              onChange={(e) => handleChange('author', e.target.value)} 
            />
          </Form.Item>
          <Form.Item label="Price">
            <Input 
              type="number"
              value={formData.price} 
              onChange={(e) => handleChange('price', parseFloat(e.target.value))} 
            />
          </Form.Item>
          <Form.Item label="Stock">
             <Input 
              type="number"
              value={formData.stock} 
              onChange={(e) => handleChange('stock', parseInt(e.target.value))} 
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default EditBookModal;