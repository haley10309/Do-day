// gemini_console.js
import readline from "readline";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

rl.question("Q: 오늘 해야 할 일은? ", async (answer) => {
  try {
    const prompt = `Q: 오늘 해야 할 일은?  
사용자의 대답: ${answer}  
이 대답을 바탕으로 맞춤형 To-do 리스트 5개를 만들어줘.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("\n✅ 맞춤형 To-do 리스트:\n");
    console.log(text);
  } catch (error) {
    console.error("Gemini API 호출 실패:", error);
  } finally {
    rl.close();
  }
});
