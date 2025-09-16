// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5050; 

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/generate", async (req, res) => {
  const { answer } = req.body;

  console.log(`[BACKEND LOG] /generate 엔드포인트 요청 수신: answer = ${answer}`); // 요청 수신 로그

  if (!answer) {
    console.log("[BACKEND LOG] answer가 비어있음. 400 에러 전송.");
    return res.status(400).json({ error: "답변이 필요합니다." });
  }

  try {
    const prompt = `Q: 오늘 해야 할 일은?  
사용자의 대답: ${answer}  
이 대답을 바탕으로 맞춤형 To-do 리스트 5개를 만들어줘.`;
    
    console.log(`[BACKEND LOG] Gemini API 호출 준비. Prompt: ${prompt.substring(0, 50)}...`); // 프롬프트 로그 (길어서 자름)
    
    // Gemini API 호출 시작! 이 부분에서 멈출 가능성 높음!
    const result = await model.generateContent(prompt); 
    
    console.log("[BACKEND LOG] Gemini API 응답 수신 완료!"); // Gemini 응답 로그
    const text = result.response.text();

    console.log("[BACKEND LOG] 클라이언트에 200 응답 전송.");
    res.json({ todos: text });
  } catch (error) {
    // Gemini API 호출 실패 로그
    console.error(`[BACKEND ERROR] Gemini API 호출 실패:`, error);
    console.log("[BACKEND LOG] 클라이언트에 500 에러 전송.");
    res.status(500).json({ error: "서버 오류" });
  }
});

app.listen(port, '0.0.0.0', () => { 
  console.log(`🚀 [BACKEND LOG] 서버 실행 중: http://0.0.0.0:${port}`);
});
