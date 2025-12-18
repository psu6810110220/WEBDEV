import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Button, Modal, message } from 'antd'; // เพิ่ม Modal และ message
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import BookList from './components/BookList.jsx';
import { getGeminiBookInfo } from './geminiService'; // Import ฟังก์ชัน Gemini

const URL_BOOK = "/api/book"

function BookScreen() {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // สถานะโหลดของ AI
  const [aiModalVisible, setAiModalVisible] = useState(false); // เปิด-ปิด Modal
  const [aiContent, setAiContent] = useState(""); // เนื้อหาจาก AI
  const [currentBookTitle, setCurrentBookTitle] = useState(""); // ชื่อหนังสือที่กำลังดู
  
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      message.error("ไม่สามารถโหลดข้อมูลหนังสือได้");
    } finally {
      setLoading(false);
    }
  }

  // ฟังก์ชันใหม่: เรียก Gemini AI
  const handleAskAI = async (book) => {
    setCurrentBookTitle(book.title);
    setAiLoading(true);
    setAiModalVisible(true);
    try {
      const result = await getGeminiBookInfo(book.title);
      setAiContent(result);
    } catch (error) {
      setAiContent("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini");
    } finally {
      setAiLoading(false);
    }
  }

  const handleEditBook = (book) => {
    navigate(`/books/edit/${book.id}`);
  }

  const handleLikeBook = async (arg) => {
    setLoading(true)
    try {
      const id = typeof arg === 'object' ? arg.id : arg;
      const bookToUpdate = bookData.find(b => b.id === id);
      if (!bookToUpdate) return;
      await axios.patch(`${URL_BOOK}/${id}`, { 
        likeCount: bookToUpdate.likeCount + 1 
      });
      fetchBooks(); 
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try {
      await axios.delete(URL_BOOK + `/${bookId}`);
      fetchBooks();
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
          <h2>My Books List</h2>
          <div>
              <Button type="primary" onClick={() => navigate('/books/add')}>
                 + New Book
              </Button>
          </div>
      </div>

      <Divider style={{ margin: '10px 0' }} />

      <Spin spinning={loading}>
        <BookList 
          data={bookData} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          onEdit={handleEditBook} 
          onViewAI={handleAskAI} // ส่ง Prop ตัวใหม่ไปให้ BookList (อย่าลืมไปรับค่าใน BookList.jsx ด้วย)
        />
      </Spin>

      {/* หน้าต่างแสดงข้อมูลจาก Gemini AI */}
      <Modal
        title={`รายละเอียดเจาะลึกโดย Gemini AI: ${currentBookTitle}`}
        open={aiModalVisible}
        onOk={() => setAiModalVisible(false)}
        onCancel={() => setAiModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setAiModalVisible(false)}>ปิด</Button>
        ]}
      >
        <Spin spinning={aiLoading}>
          <div style={{ minHeight: '200px', fontSize: '16px', lineHeight: '1.6' }}>
            {aiContent || "กำลังเตรียมข้อมูลจาก AI..."}
          </div>
        </Spin>
      </Modal>
    </>
  )
}

export default BookScreen