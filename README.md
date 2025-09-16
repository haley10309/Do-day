# Do-day
new bee's team project from ptkorea

AI를 활용한 취준생들을 위한 마음 케어 어플

#와이어 프레임
https://www.figma.com/design/lLx2lbhdPsySI389137u19/%EC%A0%A4%EB%A6%AC%EB%B9%88-Today-is-Doday~?node-id=15-19&p=f&t=GaYbDJy7w0ZazlUY-0

## 🛠️ 기술 스택

### 프론트엔드 (Mobile App)
-   **React Native:** 크로스 플랫폼 모바일 앱 개발 프레임워크
-   **Expo:** React Native 앱 개발을 위한 강력한 도구 모음 및 워크플로우
-   **Axios / Fetch API:** 백엔드 서버와의 비동기 통신
-   **React Hooks:** 상태 관리 및 컴포넌트 로직 구성

### 백엔드 (API Server)
-   **Node.js:** 서버 사이드 런타임 환경
-   **Express.js:** Node.js 웹 애플리케이션 프레임워크
-   **Google Generative AI (Gemini API):** AI 기반 To-Do 리스트 생성을 위한 핵심 API
-   **dotenv:** 환경 변수 관리
-   **CORS:** 프론트엔드와 백엔드 간 교차 출처 리소스 공유

## ⚙️ 프로젝트 설치 및 실행 방법

### 1. 전역 도구 설치

먼저 Node.js, npm/yarn, Expo CLI가 설치되어 있어야 합니다.

```bash
# Node.js 설치 (https://nodejs.org/ko/)
# npm 또는 yarn (npm은 Node.js 설치 시 함께 설치됨)
npm install -g yarn # yarn이 없다면 설치

# Expo CLI 설치
npm install -g expo-cli
# 또는
yarn global add expo-cli
