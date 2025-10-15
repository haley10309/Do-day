const userProfile = {
  name: "내일은 영업왕",
  age: 26,
  gender: "여성",
  employment_status: "1회 인턴십 수행, 취업 준비 1년차",
  mental_state: "불안 증세 및 수면 부족",
  target_job: "해외영업",
  major: "불어불문학 + 경영학 복수전공",
  preferences: {
    notifications: "최대한 적게 받고 싶어요",
    usage_time: "점심·쉬는 시간 틈틈이",
    stress: "종종 쌓이곤 해요",
    lethargy: "자주 무기력함을 느껴요",
    sleep: "5시간 이하로 거의 못 자요",
    self_efficacy: "자신감이 부족해 도전이 망설여져요",
    concentration: "30분도 채 안 돼서 집중이 흐트러져요",
    exercise: "운동은 거의 안 해요",
    recovery: "음악을 들으며 기분 전환",
    preparation_period: "1년 이상",
    main_activities: "자기소개서 다듬기, 어학·자격증 기초 쌓기",
    interests: "경영/기획/전략",
  },
};

const monthData = {
  metrics: {
    completion_rate: 0.8,
    active_days: 13,
    avg_todos_per_day: 3.9,
    carryover_rate: 0.18,
  },
  delta_vs_prev: {
    completion_rate: 0.16,
    active_days: 2,
  },
  todos: [
    { date: "2025-09-01", status: "done", difficulty: 2, source: "ai" },
    { date: "2025-09-02", status: "carryover", difficulty: 3, source: "ai" },
    { date: "2025-09-03", status: "done", difficulty: 3, source: "ai" },
    { date: "2025-09-04", status: "done", difficulty: 4, source: "ai" },
    {
      date: "2025-09-05",
      status: "done",
      difficulty: 3,
      source: "ai",
      resurfaced: true,
    },
    { date: "2025-09-06", status: "carryover", difficulty: 3, source: "ai" },
    { date: "2025-09-07", status: "done", difficulty: 2, source: "ai" },
    { date: "2025-09-08", status: "done", difficulty: 3, source: "ai" },
    { date: "2025-09-09", status: "done", difficulty: 3, source: "ai" },
    { date: "2025-09-10", status: "done", difficulty: 3, source: "ai" },
  ],
  difficulty_policy: {
    recent_window_days: 3,
    rules: [
      { if_recent_completion_lt: 0.5, action: "easier" },
      { if_recent_completion_ge: 0.9, action: "harder" },
      { resurfaced_yesterday_incomplete: true },
    ],
  },
};

// ✅ API 호출
async function generateReport() {
  try {
    const response = await fetch("http://localhost:8081/ai-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userProfile, monthData }),
    });

    const data = await response.json();
    console.log("\n✅ AI 월간 리포트 결과:\n");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ API 호출 실패:", err);
  }
}

generateReport();
