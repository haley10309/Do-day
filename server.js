// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // .env 파일 로드

const app = express();
const port = 5050; // 이 포트 번호는 그대로 유지!

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// 모델은 "gemini-2.0-flash" 그대로 유지 (가장 빠르고 비용 효율적)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 

app.post("/generate", async (req, res) => {
  // ★★★ 백엔드에서 받을 변수명 수정: answer -> surveyResult, userRequest 추가 ★★★
  const { answer: surveyResult, userRequest } = req.body; 

  console.log(`[BACKEND LOG] /generate 엔드포인트 요청 수신: 
  - 설문조사 결과 (surveyResult): ${surveyResult ? surveyResult.substring(0, 50) + '...' : '없음'}
  - 사용자 요청 (userRequest): ${userRequest || '없음'}`);

  // ★★★ 필수 파라미터 확인: 설문조사 결과와 사용자 요청 모두 필요 ★★★
  if (!surveyResult || !userRequest) { 
    console.log("[BACKEND LOG] 필수 파라미터(surveyResult 또는 userRequest)가 비어있음. 400 에러 전송.");
    return res.status(400).json({ error: "설문조사 결과와 오늘의 목표(userRequest)가 모두 필요합니다." });
  }

  try {
    // ★★★ 바로 여기가 새로 업데이트된 Gemini 프롬프트! ★★★
    const prompt = `당신은 사용자의 생활 습관과 요청을 바탕으로 To-do 리스트를 생성하는 AI 어시스턴트입니다.
사용자의 생활 습관 및 선호도 설문조사 결과는 다음과 같습니다:
"""
${surveyResult}
"""

이 정보를 바탕으로, 다음 사용자의 요청에 대해 **딱 5개의 맞춤형 To-do 리스트 항목을 JSON 배열 형태로 생성**해주세요.
사용자의 요청: "${userRequest}"

각 To-do 항목은 반드시 다음 세 가지 속성을 포함해야 합니다:
-   \`id\`: 각 항목을 고유하게 식별하는 짧은 문자열 (예: 'task1', 'item_b'). 앱 내부에서 사용할 고유 키 역할을 합니다.
-   \`task\`: To-do 항목의 상세 내용 (문자열).
-   \`completed\`: 이 To-do 항목의 초기 완료 상태를 나타내는 불리언 값 (무조건 \`false\`로 설정).

**응답은 반드시 JSON 배열 형태여야 하며, 추가적인 설명이나 문구는 절대로 포함하지 마세요.**
(아무런 서두나 마무리 문장 없이 오직 JSON 텍스트만 출력)

**예시 JSON 형식:**
\`\`\`json
[
  {
    "id": "todo1",
    "task": "아침 식사 준비 (간단한 토스트와 커피)",
    "completed": false
  },
  {
    "id": "todo2",
    "task": "오전 업무 시작 전 이메일 확인 및 중요도 분류",
    "completed": false
  },
  {
    "id": "todo3",
    "task": "점심 식사 후 10분간 짧은 산책",
    "completed": false
  },
  {
    "id": "todo4",
    "task": "프로젝트 A의 보고서 초안 작성",
    "completed": false
  },
  {
    "id": "todo5",
    "task": "퇴근 후 다음 날 To-do 리스트 미리 작성",
    "completed": false
  }
]
\`\`\`
`;
    
    console.log(`[BACKEND LOG] Gemini API 호출 준비. Prompt 길이: ${prompt.length}자.`); 
    
    // Gemini API 호출 시작! 이 부분에서 fetch failed 에러가 나면 네트워크 문제!
    const result = await model.generateContent(prompt); 
    
    console.log("[BACKEND LOG] Gemini API 응답 수신 완료!"); 
    let text = result.response.text(); // Gemini가 준 텍스트 응답

    // ★★★ Gemini가 JSON을 마크다운 코드 블록으로 줬을 경우, 그걸 제거하는 로직 ★★★
    if (text.startsWith('```json') && text.endsWith('```')) {
        text = text.substring(7, text.length - 3).trim();
    }
    
    // ★★★ Gemini 응답 텍스트를 JSON으로 파싱! ★★★
    let parsedTodos;
    try {
      parsedTodos = JSON.parse(text);
      // JSON 형식이 아니거나 배열이 아니면 에러 처리 (프롬프트가 잘 작동하는지 확인하는 과정)
      if (!Array.isArray(parsedTodos)) {
        throw new Error("Gemini 응답이 유효한 JSON 배열 형식이 아닙니다.");
      }
    } catch (parseError) {
      console.error(`[BACKEND ERROR] Gemini 응답 JSON 파싱 실패:`, parseError);
      console.error(`[BACKEND ERROR] 파싱 실패 원본 텍스트 (Raw response from Gemini):`, text);
      return res.status(500).json({ error: "Gemini 응답을 JSON으로 변환하는 데 실패했습니다.", originalResponse: text });
    }

    console.log("[BACKEND LOG] 클라이언트에 200 응답 전송.");
    res.json({ todos: parsedTodos }); // 파싱된 JSON 배열을 클라이언트에 보낸다!
  } catch (error) {
    // Gemini API 호출 실패 로그
    console.error(`[BACKEND ERROR] Gemini API 호출 실패:`, error);
    console.log("[BACKEND LOG] 클라이언트에 500 에러 전송.");
    res.status(500).json({ error: "서버 오류: " + error.message }); // 에러 메시지도 함께 전달
  }
});

// server.js 하단에 추가
// server.js 파일 내 congrats 엔드포인트 수정

app.post("/congrats", async (req, res) => {
    const { surveyResult, task } = req.body;
  
    if (!surveyResult || !task) {
      return res.status(400).json({ error: "surveyResult와 task가 필요합니다." });
    }
  
    try {
      const prompt = `당신은 사용자의 생활 습관과 성취를 응원하는 AI 어시스턴트입니다.
  사용자의 설문조사 결과:
  """
  ${surveyResult}
  """
  이번에 완료한 To-do: "${task.task}"
  
  위 정보를 참고해, 사용자에게 딱 한 줄짜리 따뜻하고 개인화된 축하 메시지를 작성하세요.
  조건:
  - 한국어로 작성
  - 이모지 포함 (최대 2개)
  - 설명이나 코드 블록 없이 메시지 한 줄만 출력
  `; // task가 객체로 넘어오므로 task.task로 접근!

      console.log(`[BACKEND LOG] Congrats Prompt: ${prompt.substring(0, 300)}...`); // 프롬프트 로그

      const result = await model.generateContent(prompt);
      let text = result.response.text(); // ★★★ 여기부터 응답 내용 확인! ★★★

      // --- 디버깅용 로그 추가 ---
      console.log(`[BACKEND LOG] Raw Gemini Response Text: ${text}`); 
      // --- 여기까지 추가! ---
  
      // 혹시 Gemini가 코드블록으로 감싸는 경우 제거 (이전 로직)
      if (text.startsWith("```") && text.endsWith("```")) {
        text = text.replace(/```[a-z]*\n?/g, "").trim();
      }

      // 최종 메시지 확인
      console.log(`[BACKEND LOG] Final Congrats Message (after cleanup): ${text}`);
  
      res.json({ message: text });
    } catch (error) {
      console.error("[BACKEND ERROR] /congrats 호출 실패:", error);
      // 에러 발생 시 클라이언트에 더 상세한 에러 로그 보내기
      res.status(500).json({ error: "축하 메시지 생성 실패: " + error.message, debug: error.stack });
    }
  });

app.listen(port, '0.0.0.0', () => { 
  console.log(`🚀 [BACKEND LOG] 서버 실행 중: http://localhost:${port}`);
  console.log(`💡 [BACKEND LOG] 아이폰에서 접속하려면 http://[니_맥북_IP]:${port}/generate 로 해봐!`);
});