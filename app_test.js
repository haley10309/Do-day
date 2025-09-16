

// App.js (Expo 프로젝트)
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, View, ScrollView, ActivityIndicator, Alert } from "react-native";

export default function App() {
  // ★★★ 여기 "192.168.X.X" 부분을 니 맥북의 실제 IP 주소로 바꿔줘! ★★★
  // (예: 192.168.0.100)
  const [macIpAddress, setMacIpAddress] = useState("192.168.11.9"); // <--- 이거 수정해야 함!!!
  const [testResult, setTestResult] = useState("버튼을 눌러 연결 테스트 시작! 👇");
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    // if (macIpAddress === "http://192.168.11.255") {
    //   Alert.alert("🚨 IP 주소를 입력해주세요!", "맥북의 실제 IP 주소를 'http://192.168.11.255' 대신 입력해주세요.");
    //   return;
    // }

    setIsLoading(true);
    setTestResult(`🌐 http://${macIpAddress}:6050/test 로 연결 시도 중...`);

    try {
      // /test 엔드포인트로 GET 요청 날리기!
      const response = await fetch(`http://${macIpAddress}:6050/test`);

      if (!response.ok) { // HTTP 상태 코드가 200번대가 아니면 에러로 처리
        const errorText = await response.text();
        throw new Error(`HTTP 에러! 상태: ${response.status}, 내용: ${errorText}`);
      }

      const data = await response.json();
      setTestResult(`✅ 연결 성공: ${data.message}`);
    } catch (error) {
      console.error("❌ 연결 실패 콘솔 로그:", error);
      setTestResult(`❌ 연결 실패! 네트워크 문제 or 서버 확인 (콘솔 로그를 봐줘!)`);
      Alert.alert("😱 연결 실패!", `자세한 내용은 콘솔 로그를 확인해주세요: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👻 서버 연결 테스트</Text>

      <Text style={styles.label}>1. 맥북 IP 주소를 입력하세요 (ifconfig로 확인):</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 192.168.0.100"
        value={macIpAddress}
        onChangeText={setMacIpAddress}
        autoCapitalize="none"
        keyboardType="numbers-and-punctuation"
      />
      
      <Button 
        title={isLoading ? "연결 중..." : "서버 연결 테스트 시작"} 
        onPress={handleTestConnection} 
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />}

      <ScrollView style={styles.resultBox}>
        <Text style={styles.result}>{testResult}</Text>
      </ScrollView>

      <Text style={styles.tip}>
        💡 폰과 맥북이 **같은 Wi-Fi**에 연결되어 있어야 해!
        방화벽은 꺼져있는지 다시 한 번 확인해!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  resultBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    minHeight: 100,
  },
  result: { fontSize: 16, lineHeight: 24, color: '#333' },
  spinner: { marginTop: 20 },
  tip: { fontSize: 13, color: '#666', marginTop: 20, textAlign: 'center' }
});
