import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Easing } from "react-native";

export default function CongratsMessage({ visible, task, onClose, macIpAddress, port }) {
  const [message, setMessage] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  // 🟣 애니메이션은 visible 기반으로만 실행
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // 🟣 메시지 가져오기
  useEffect(() => {
    let isMounted = true;
    const fetchMessage = async () => {
      if (!task) return;
      try {
        const res = await fetch(`http://${macIpAddress}:${port}/congrats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task }),
        });
        const data = await res.json();
        if (isMounted) setMessage(data.message);
      } catch (err) {
        console.error(err);
        if (isMounted) setMessage("축하합니다! 멋지게 완료했네요 🎉");
      }
    };
    fetchMessage();
    return () => (isMounted = false);
  }, [task]);

  // 🟣 닫기 애니메이션 완료 후 부모에 알림
  const handleClosePress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      // ✅ 모달이 완전히 닫힌 후 상태 변경
      onClose();
    });
  };

  // 🟣 여기서 task 검사하지 말기 (❌ if (!task) return null;)
  // visible만으로 표시 여부 결정
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClosePress}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            width: "80%",
            alignItems: "center",
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#9333ea", marginBottom: 10 }}>
            🎉 축하합니다!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#374151",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {message || "메시지 로딩 중..."}
          </Text>
          <TouchableOpacity
            onPress={handleClosePress}
            style={{
              backgroundColor: "#ec4899",
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>닫기</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
