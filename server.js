// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // .env 파일 로드

const app = express();
const port = 8081; // 이 포트 번호는 그대로 유지!

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// 모델은 "gemini-2.0-flash" 그대로 유지 (가장 빠르고 비용 효율적)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
const surveyResult = `
나이: 26세
성별: 여성
취업 준비 현황: 1회 인턴십 수행, 취업 준비 시작한 지 1년정도
멘탈 현황: 불안 증세 및 수면 부족
지원 직무: 해외영업
전공 상황: 불어불문학과 + 경영학과 복수전공

[선택된 답변 요약]
- 알림 설정: 최대한 적게 받고 싶어요
- 앱 사용 시간대: 점심·쉬는 시간 틈틈이
- 스트레스: 종종 쌓이곤 해요, 관리가 필요하다고 느껴요
- 무기력도: 자주 무기력함을 느껴요
- 수면: 거의 못 자는 편이에요 (5시간 이하)
- 자기효능감: 자신감이 많이 부족해 도전 자체가 망설여져요
- 집중력: 30분도 채 안 돼서 쉽게 흐트러져요
- 운동습관: 운동은 거의 안 해요
- 에너지 회복: 음악을 들으며 기분을 바꿔요
- 취업 준비 기간: 1년 이상
- 주요 활동: 자기소개서 다듬기, 전반적인 기초 쌓기(어학, 자격증 등)
- 관심 직무: 경영/기획/전략
`;

const userRequest = "오늘은 불안함을 줄이고 자기 효능감을 높이는 하루를 보내고 싶어요.";

// ✅ 설문조사 없이 바로 To-do 생성 API
app.get("/generate", async (req, res) => {
  console.log("[BACKEND] /generate 호출됨");

  try {
    const prompt = `
당신은 사용자의 생활 습관, 멘탈 상태, 취업 준비 상황을 바탕으로 맞춤형 To-do 리스트를 제안하는 AI 어시스턴트입니다.

사용자의 설문조사 결과:
"""
${surveyResult}
"""

사용자의 요청: "${userRequest}"

이 정보를 바탕으로 **딱 5개의 To-do 리스트 항목을 각각 17자내로 JSON 배열 형태로 생성**해주세요.

각 항목은 반드시 다음 세 가지 속성을 포함해야 합니다:
- "id": 고유 식별자 (예: "task1")
- "task": 구체적이고 실천 가능한 한 문장의 할 일
- "completed": 초기값은 항상 false

응답은 오직 JSON 배열 형태로만 주세요. 설명, 문장, 코드블록 없이 JSON만!
`;

    console.log(`[BACKEND LOG] Gemini API 호출 준비. Prompt 길이: ${prompt.length}자.`);

    const result = await model.generateContent(prompt);
    console.log("[BACKEND LOG] Gemini API 호출 직후");

    let text = result.response.text();

    console.log("[BACKEND LOG] Gemini 응답:", text);

    // JSON 마크다운 코드블록 제거
    if (text.startsWith("```json") && text.endsWith("```")) {
      text = text.substring(7, text.length - 3).trim();
    }

    let parsedTodos;
    try {
      parsedTodos = JSON.parse(text);
      if (!Array.isArray(parsedTodos)) {
        throw new Error("Gemini 응답이 유효한 JSON 배열 형식이 아닙니다.");
      }
    } catch (parseError) {
      console.error("[BACKEND ERROR] Gemini 응답 JSON 파싱 실패:", parseError);
      console.error("[BACKEND ERROR] Raw response from Gemini:", text);
      return res.status(500).json({ error: "Gemini 응답 JSON 파싱 실패", originalResponse: text });
    }

    res.json({ todos: parsedTodos });
  } catch (error) {
    console.error("[BACKEND ERROR] Gemini API 호출 실패:", error);
    res.status(500).json({ error: "To-do 생성 실패: " + error.message });
  }
});
app.get("/generate_test", (req, res) => {
  console.log("[BACKEND] /generate 호출됨 (더미 데이터)");
  const dummyTodos = [
    { id: "task1", task: "테스트 1", completed: false },
    { id: "task2", task: "테스트 2", completed: false },
    { id: "task3", task: "테스트 3", completed: false },
    { id: "task4", task: "테스트 4", completed: false },
    { id: "task5", task: "테스트 5", completed: false },
  ];
  res.json({ todos: dummyTodos });
});

// server.js 하단에 추가
// server.js 파일 내 congrats 엔드포인트 수정

app.post("/congrats", async (req, res) => {
    const { task } = req.body;
  
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
  app.get("/", (req, res) => {
    res.send("서버가 정상 실행 중입니다!");
  });
  

app.listen(port, '0.0.0.0', () => { 
  console.log(`🚀 [BACKEND LOG] 서버 실행 중: http://localhost:${port}`);
  console.log(`💡 [BACKEND LOG] 아이폰에서 접속하려면 http://[니_맥북_IP]:${port}/generate 로 해봐!`);
});