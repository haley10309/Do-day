// App.js (최종 버전: 키보드 숨김, 입력값 표시, 에러 방지)
import React, { useState } from "react";
import { 
  StyleSheet, Text, TextInput, Button, View, ScrollView, Alert, Keyboard, 
  KeyboardAvoidingView, TouchableWithoutFeedback, Platform // <--- 추가된 임포트
} from "react-native";
import LoadingOverlay from './LoadingOverlay';

export default function App() {
  const [input, setInput] = useState("");
  const [displayedInput, setDisplayedInput] = useState(""); // <--- 추가: 결과와 함께 보여줄 입력값
  const [todoList, setTodoList] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAC_IP_ADDRESS = "192.168.11.9"; // ★★★ 니 맥북 실제 IP로 다시 확인! ★★★
  const PORT = 5050; // 백엔드 서버 포트

  const handleSubmit = async () => {
    // 키보드 숨기기 (요구사항)
    Keyboard.dismiss(); 

    if (!input.trim()) {
      Alert.alert("🤔 입력값이 없네요!", "오늘 해야 할 일을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${MAC_IP_ADDRESS}:${PORT}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `서버 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      setTodoList(data.todos);
      setDisplayedInput(input); // <--- 추가: 성공하면 입력값 저장!
      setInput(""); // 입력창 비우기
    } catch (error) {
      console.error("서버 요청 실패:", error);
      Alert.alert("🤯 To-do 리스트 생성 실패!", `오류: ${error.message || '알 수 없는 오류 발생'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ★★★ Fragment로 최상위를 감싸는 것은 유지! ★★★
    <> 
      {/* 키보드 피하기 + 빈 공간 터치 시 키보드 닫기 */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS만 padding, Android는 height (혹은 null)
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>📝 오늘의 목표를 입력하세요</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 운동하기, 공부하기"
              value={input}
              onChangeText={setInput}
              multiline={true}
              numberOfLines={3}
            />
            <Button title="To-do 리스트 생성" onPress={handleSubmit} />

            <ScrollView style={styles.resultBox}>
              {displayedInput ? ( // <--- 추가: 입력값이 있으면 보여줌
                <View style={styles.displayedInputContainer}>
                  <Text style={styles.displayedInputLabel}>✅ 당신의 목표:</Text>
                  <Text style={styles.displayedInputText}>{displayedInput}</Text>
                  <Text style={styles.resultLabel}>✨ 맞춤 To-do 리스트:</Text>
                </View>
              ) : null}
              <Text style={styles.resultText}>{todoList || "아직 생성된 To-do 리스트가 없어요!"}</Text>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      {/* LoadingOverlay는 계속 유지 */}
      <LoadingOverlay 
        visible={isLoading} 
        message="Gemini가 To-do 리스트를 멋지게 만드는 중..." 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resultBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    minHeight: 150,
  },
  displayedInputContainer: { // <--- 추가 스타일
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  displayedInputLabel: { // <--- 추가 스타일
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  displayedInputText: { // <--- 추가 스타일
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  resultLabel: { // <--- 추가 스타일
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  resultText: { // 이전 result에서 이름 변경
    fontSize: 16, 
    lineHeight: 24, 
    color: '#333' 
  },
});