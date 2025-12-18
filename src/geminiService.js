/* ใช้ Gemini 3 Flash ผ่าน SDK ตัวใหม่ (@google/genai) */
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyDfk4H3FW8kF6HwZ-pbc083pRy1jPsZA94"; 

export const getGeminiBookInfo = async (bookTitle) => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // ใช้ชื่อโมเดลตามที่ตั้งใจไว้
    const modelName = "gemini-3-flash-preview"; 

    console.log(`🚀 กำลังเรียกใช้ ${modelName}...`);

    const response = await ai.models.generateContent({
      model: modelName, 
      contents: [
        {
          parts: [
            { text: `รีวิวหนังสือ "${bookTitle}" ให้หน่อย ขอสรุปจุดเด่นและเนื้อหาสำคัญเป็นภาษาไทย ความยาวไม่เกิน 5 บรรทัด` }
          ],
        },
      ],
    });

    // 🔴 จุดที่แก้: ใช้ .text เฉยๆ (ไม่ต้องมีวงเล็บ)
    return response.text || "AI ไม่ส่งคำตอบกลับมา";

  } catch (error) {
    console.error("Gemini Error:", error);
    
    // ดัก Error เผื่อชื่อโมเดลผิด
    if (error.message && error.message.includes("404")) {
        return "Error 404: หาชื่อโมเดลไม่เจอ ลองเปลี่ยนเป็น 'gemini-1.5-flash' แทนนะครับ";
    }
    return `เกิดข้อผิดพลาด: ${error.message}`;
  }
};