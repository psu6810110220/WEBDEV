import { Table, Button, Space, Popconfirm, Tag, Image, Typography, Tooltip } from 'antd';
import { RobotOutlined, EditOutlined, LikeOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function BookList(props) {

  const columns = [
    // 1. Title (ล็อคไว้ซ้ายสุดเวลาเลื่อนตาราง)
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left', 
      width: 150,
      render: (text) => <Text strong>{text}</Text>
    },
    // 2. Author
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (text) => text || <Text type="secondary">-</Text>
    },
    // 3. Description (ตัดคำถ้ามันยาวเกินไป)
    {
      title: 'Description',
      dataIndex: 'description', // ต้องมั่นใจว่า Backend ส่ง key นี้มา
      key: 'description',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0, fontSize: '13px' }}>
            {text || <Text type="secondary">ไม่มีรายละเอียด</Text>}
          </Paragraph>
        </Tooltip>
      )
    },
    // 4. Price
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => (
        price ? <Text type="success">฿{price.toLocaleString()}</Text> : <Tag>Free</Tag>
      )
    },
    // 5. ISBN
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      width: 120,
      render: (text) => <Text code>{text || '-'}</Text>
    },
    // 6. Stock
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      align: 'center',
      render: (stock) => (
        <span style={{ color: stock < 10 ? 'red' : 'inherit', fontWeight: stock < 10 ? 'bold' : 'normal' }}>
          {stock !== undefined ? stock : '-'}
        </span>
      )
    },
    // 7. Cover
    {
      title: 'Cover',
      dataIndex: 'coverUrl',
      key: 'cover',
      width: 100,
      render: (text) => (
        <Image 
          src={`http://localhost:3080/${text}`} 
          height={60} 
          width={45}
          style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #f0f0f0' }}
          fallback="https://via.placeholder.com/45x60?text=No+Img"
        />
      )
    },
    // 8. Category
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (value) => (
        <Tag color="blue">{value?.name || "Uncategorized"}</Tag>
      ),
    },
    // 9. Liked
    {
      title: 'Liked',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      align: 'center',
      render: (count) => (
        <span><LikeOutlined style={{ color: 'red' }} /> {count}</span>
      )
    },
    // 10. Action (รวมปุ่ม AI เข้ามาในนี้ด้วยเลยเพื่อความประหยัดพื้นที่)
    {
      title: 'Action',
      key: 'action',
      fixed: 'right', // ล็อคไว้ขวาสุด
      width: 220,
      render: (_, record) => (
        <Space size="small">
          {/* ปุ่ม AI */}
          <Tooltip title="Ask AI">
            <Button 
              type="primary" 
              shape="circle"
              icon={<RobotOutlined />} 
              onClick={() => props.onViewAI(record)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            />
          </Tooltip>
          
          {/* ปุ่ม Like */}
          <Tooltip title="Like">
            <Button shape="circle" icon={<LikeOutlined />} onClick={() => props.onLiked(record.id)} />
          </Tooltip>

          {/* ปุ่ม Edit */}
          <Tooltip title="Edit">
             <Button shape="circle" icon={<EditOutlined />} onClick={() => props.onEdit(record)} />
          </Tooltip>

          {/* ปุ่ม Delete */}
          <Popconfirm title="ลบหนังสือเล่มนี้?" onConfirm={() => props.onDeleted(record.id)}>
            <Button danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  return (
    <Table 
      rowKey="id" 
      dataSource={props.data} 
      columns={columns} 
      // เพิ่ม scroll x เพื่อให้ตารางเลื่อนแนวนอนได้ถ้ารูปแบบหน้าจอมือถือ
      scroll={{ x: 1300 }} 
      pagination={{ pageSize: 10 }}
      // ไฮไลท์แถวสีแดงถ้าของหมด (stock = 0)
      rowClassName={(record) => record.stock === 0 ? "bg-red-50" : ""} 
    />
  )
}
