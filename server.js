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
이름 : ptk
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

const userRequest =
  "오늘은 불안함을 줄이고 자기 효능감을 높이는 하루를 보내고 싶어요.";

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

    console.log(
      `[BACKEND LOG] Gemini API 호출 준비. Prompt 길이: ${prompt.length}자.`
    );

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
      return res
        .status(500)
        .json({ error: "Gemini 응답 JSON 파싱 실패", originalResponse: text });
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

    console.log(
      `[BACKEND LOG] Congrats Prompt: ${prompt.substring(0, 300)}...`
    ); // 프롬프트 로그

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
    console.log(
      `[BACKEND LOG] Final Congrats Message (after cleanup): ${text}`
    );

    res.json({ message: text });
  } catch (error) {
    console.error("[BACKEND ERROR] /congrats 호출 실패:", error);
    // 에러 발생 시 클라이언트에 더 상세한 에러 로그 보내기
    res.status(500).json({
      error: "축하 메시지 생성 실패: " + error.message,
      debug: error.stack,
    });
  }
});

/**
 * AI 리포트 생성
 */
// ✅ 난이도 분석 메트릭 계산 함수
function buildDifficultyMetrics(todos = []) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sumA = 0,
    sumD = 0,
    cntA = 0,
    cntD = 0,
    resurfaced = 0,
    resurfacedDone = 0;

  for (const t of todos) {
    const lv = Math.max(1, Math.min(5, t.difficulty ?? 3));
    dist[lv]++;
    sumA += lv;
    cntA++;
    if (t.status === "done") {
      sumD += lv;
      cntD++;
    }
    if (t.status === "carryover") resurfaced++;
    if (t.status === "done" && t.resurfaced === true) resurfacedDone++;
  }

  const dates = [...new Set(todos.map((t) => t.date))].sort();
  const last3 = dates.slice(-3);
  let recentDone = 0,
    recentTotal = 0;
  for (const d of last3) {
    const items = todos.filter((t) => t.date === d);
    recentDone += items.filter((t) => t.status === "done").length;
    recentTotal += items.length;
  }
  const recent3d = recentTotal ? recentDone / recentTotal : 0;

  const week = (d) => Math.ceil(new Date(d).getDate() / 7);
  const agg = {};
  for (const t of todos) {
    const w = week(t.date);
    agg[w] ||= { a: 0, ad: 0, d: 0, dd: 0 };
    agg[w].a += t.difficulty ?? 3;
    agg[w].ad++;
    if (t.status === "done") {
      agg[w].d += t.difficulty ?? 3;
      agg[w].dd++;
    }
  }
  const trend = Object.entries(agg).map(([w, v]) => ({
    week: +w,
    assigned: v.ad ? +(v.a / v.ad).toFixed(1) : 0,
    done: v.dd ? +(v.d / v.dd).toFixed(1) : 0,
  }));

  const aiSensitivity = +(recent3d < 0.5 || recent3d >= 0.9 ? 1 : 0).toFixed(2);

  return {
    avg_difficulty_done: cntD ? +(sumD / cntD).toFixed(1) : 0,
    avg_difficulty_assigned: cntA ? +(sumA / cntA).toFixed(1) : 0,
    difficulty_distribution: dist,
    difficulty_trend: trend,
    recent_3d_completion_rate: +recent3d.toFixed(2),
    resurfaced_tasks: resurfaced,
    resurfaced_success: resurfacedDone,
    ai_sensitivity: aiSensitivity,
  };
}

app.post("/ai-report", async (req, res) => {
  console.log("[BACKEND] /ai-report 호출됨");

  try {
    const { userProfile, monthData } = req.body;

    // 1️⃣ 난이도 메트릭 계산 (없으면 자동 계산)
    if (!monthData.difficulty_metrics && Array.isArray(monthData.todos)) {
      monthData.difficulty_metrics = buildDifficultyMetrics(monthData.todos);
    }

    // 2️⃣ 프롬프트 (report_text 내에 조언·격려 포함)
    const prompt = `
당신은 취업 준비생을 위한 감정 케어 서비스의 AI 리포트 어시스턴트입니다.
사용자의 배경, 심리상태, 루틴을 이해하고 **객관적이지만 따뜻한 어조**로 월간 리포트를 작성하세요.
리포트에는 한 달의 현황, 난이도 적응 변화, 다음 달을 위한 제안과 응원 메시지가 모두 포함되어야 합니다.

---

[리포트 톤 & 세계관 규칙]
- 앱의 콘셉트는 **오피스(Office)** 입니다.  
- 리포트는 **“회사 내부 주간/월간 리포트” 느낌**으로 작성하되,  
  문체는 따뜻하고 친근하게 유지하세요.  
- 문장에 “업무”, “성과”, “리듬”, “프로젝트”, “피드백” 등의 오피스 단어를 자연스럽게 녹여보세요.
- 예시:
  - “이번 달은 자기관리 프로젝트의 진척률이 80%로, 루틴이 한층 안정되었습니다.”
  - “집중력이 회복되며 목표 관리 역량이 향상된 모습이에요.”
  - “다음 달에는 리프레시 타임을 일정에 반영해보세요.”
- 단, 너무 역할극처럼 쓰지 말고 ‘리포트 스타일의 어조’로 구성하세요.
  (예: ‘팀장님의 보고서 코멘트’ 느낌)
- 마지막에는 한 줄의 **격려 문장**으로 마무리하세요.
  (예: “이번 달의 성실함을 다음 달에도 이어가요 💼”)

---

[사용자 프로필]
${JSON.stringify(userProfile, null, 2)}

---

[한 달간의 활동 데이터]
${JSON.stringify(monthData, null, 2)}

---

출력은 반드시 JSON 형식 하나로 반환하세요. 코드블록(\`\`\`)이나 설명 없이 JSON만 출력합니다.

출력 형식(JSON):
{
  "report_text": "이번 달 요약 + 다음 달 제안 + 격려까지 한 문단으로 자연스럽게 연결 (350~450자)",
  "highlights": ["핵심 변화 1", "핵심 변화 2"],
  "traits": ["특성 1", "특성 2"],
  "difficulty_summary": {
    "recent_3d_completion_rate": "<백분율>",
    "resurfaced_success_rate": "<백분율>",
    "assigned_vs_done_avg": "<ex: 2.9 → 2.7>",
    "policy_effect": "<난이도 조정에 대한 한 줄 요약>"
  },
  "difficulty_plan_next_month": [
    "난이도/시간대 관련 제안 1",
    "난이도/시간대 관련 제안 2"
  ]
}

작성 규칙:
- 사용자의 멘탈 상태, 집중력, 수면, 자기 효능감 등 프로필을 해석에 반영.
- monthData의 completion_rate, carryover_rate, difficulty_metrics 기반으로 달성 수준 분석.
- 다음 달 제안(next_month_tips)과 encouragement_message는 report_text 본문 내에서 자연스럽게 포함.
- 예: “이번 달은 불안이 잦았지만, 루틴을 다시 세워가는 과정이었습니다. 다음 달에는 오전 루틴을 중심으로 난이도를 조정해보세요. 이번 달의 자신을 믿어도 좋아요 💪”
- 감정 과하지 않게 따뜻한 어조 유지, 사실 기반 문장으로 작성.
- JSON만 반환하세요.
`;

    // 3️⃣ Gemini 호출
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // 4️⃣ 코드블록 제거
    if (text.startsWith("```")) text = text.replace(/```[a-z]*\n?/g, "").trim();

    // 5️⃣ JSON 파싱
    const parsed = JSON.parse(text);
    res.json({ aiReport: parsed });
  } catch (error) {
    console.error("[BACKEND ERROR] /ai-report 실패:", error);
    res.status(500).json({ error: "AI 리포트 생성 실패: " + error.message });
  }
});

app.get("/", (req, res) => {
  res.send("서버가 정상 실행 중입니다!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 [BACKEND LOG] 서버 실행 중: http://localhost:${port}`);
  console.log(
    `💡 [BACKEND LOG] 아이폰에서 접속하려면 http://[니_맥북_IP]:${port}/generate 로 해봐!`
  );
});
