import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import sendIcon from "./img/teams/send_icon.png"; // 👉 전송 버튼 이미지 (대체 가능)
import profile1 from "./img/teams/profile1.png";
import profile2 from "./img/teams/profile2.png";
import profile3 from "./img/teams/profile3.png";

export default function TeamsScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "system",
      text: "그룹미션: 요가하고 플루레몬 레깅스 응모하기",
    },
    { id: "2", type: "mine", text: "이번 주도 화이팅입니다!" },
    { id: "3", type: "other", text: "축하합니다! 계속 해봐요.", profile: profile1 },
    { id: "4", type: "other", text: "다들 이번 주도 힘내서 투두 열심히 해봐요!", profile: profile2 },
    { id: "5", type: "other", text: "다들 이번 주도 힘내서 투두 열심히 해봐요! 응원합니다~", profile: profile3 },
    { id: "6", type: "system", text: "취준쌤푸님이 자기 개발 책 일감 읽기를 성공했습니다!" },
    { id: "7", type: "mine", text: "축하합니다! :D" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      type: "mine",
      text: inputText,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const renderMessage = ({ item }) => {
    if (item.type === "system") {
      return (
        <View style={styles.systemMessageWrapper}>
          <Text style={styles.systemMessage}>{item.text}</Text>
        </View>
      );
    }

    if (item.type === "mine") {
      return (
        <View style={styles.myMessageWrapper}>
          <View style={styles.myBubble}>
            <Text style={styles.myText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.otherMessageWrapper}>
        <Image source={item.profile} style={styles.profileImage} />
        <View style={styles.otherBubble}>
          <Text style={styles.otherText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 상단 그룹 정보 */}
      <View style={styles.header}>
        <Text style={styles.groupTitle}>UI/UX 디자이너 그룹</Text>
        <Text style={styles.groupSubtitle}>
          그룹미션: 요가하고 플루레몬 레깅스 응모하기
        </Text>
      </View>

      {/* 채팅 메시지 리스트 */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {/* 입력창 */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Image source={sendIcon} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF0D5" },

  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2D7B6",
    backgroundColor: "#FBE8C7",
  },
  groupTitle: { fontSize: 18, fontWeight: "bold", color: "#4A3C2A" },
  groupSubtitle: { fontSize: 14, color: "#7C6A54", marginTop: 5 },

  chatContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  // 시스템 메시지 (중앙 회색)
  systemMessageWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  systemMessage: {
    backgroundColor: "#FFF0C1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 13,
    color: "#6A5D47",
  },

  // 내 메시지
  myMessageWrapper: {
    alignItems: "flex-end",
    marginVertical: 6,
  },
  myBubble: {
    backgroundColor: "#FFD37A",
    padding: 10,
    borderRadius: 15,
    borderTopRightRadius: 0,
    maxWidth: "75%",
  },
  myText: { fontSize: 15, color: "#4A3C2A" },

  // 상대방 메시지
  otherMessageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  otherBubble: {
    backgroundColor: "#FFE9C0",
    padding: 10,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    maxWidth: "75%",
  },
  otherText: { fontSize: 15, color: "#4A3C2A" },

  // 입력창
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2D7B6",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    color: "#4A3C2A",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#FFD37A",
    borderRadius: 20,
    padding: 8,
  },
  sendIcon: { width: 20, height: 20 },
});
