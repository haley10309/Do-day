// simple_test_server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // Optional but good practice for POST
// dotenv랑 Gemini API 관련된 건 일단 싹 뺐어.
// 순수하게 연결만 볼 거니까!

const app = express();
const port = 6050; // 니가 원래 쓰던 포트 그대로!

app.use(cors()); // 모든 도메인에서 요청 허용! (테스트용)
app.use(bodyParser.json()); // JSON 형식 바디 파싱

// ★★★ 이 부분이 중요! '0.0.0.0'을 명시해서 모든 네트워크 인터페이스에서 요청을 받게 함 ★★★
// 이렇게 안 하면 특정 환경에서 외부에서 접근 못할 수 있어.
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 [테스트 서버] 진짜 시작됨: http://localhost:${port}`);
  console.log(`💡 아이폰에서 접속하려면 http://[니_맥북_IP]:${port}/test 로 해봐!`);
});

// 초간단 GET 요청 엔드포인트: 연결만 확인하는 용도!
app.get('/test', (req, res) => {
  console.log('✅ /test 엔드포인트로 요청이 들어왔음!');
  res.json({ message: "백엔드 연결 성공! 미미가 응답했다네! 😎" });
});

// 니가 원래 쓰던 /generate 엔드포인트도 단순화해서 넣어줄게.
// Gemini API 호출 없이 그냥 응답하도록!
app.post("/generate", async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
    return res.status(400).json({ error: "답변이 없는데요..?" });
  }
  console.log(`💬 /generate 엔드포인트로 '${answer}' 요청이 들어왔음!`);
  res.json({ todos: `백엔드가 ${answer}에 대해 응답합니다! (테스트용)` });
});
