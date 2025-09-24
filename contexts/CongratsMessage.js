import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Easing } from "react-native";

export default function CongratsMessage({ surveyResult, task, onClose, macIpAddress, port }) {
  const [message, setMessage] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    if (task) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 100, useNativeDriver: true }),
      ]).start();

      fetch(`http://${macIpAddress}:${port}/congrats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyResult, task }),
      })
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(err => {
          console.error(err);
          setMessage("축하합니다! 멋지게 완료했네요 🎉");
        });
    } else {
      setMessage("");
    }
  }, [task]);

  const handleClosePress = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, easing: Easing.ease, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, easing: Easing.ease, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  if (!task) return null;

  return (
    <Modal transparent visible={!!task} animationType="none" onRequestClose={handleClosePress}>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', opacity: fadeAnim }}>
        <Animated.View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, width: '80%', alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#9333ea', marginBottom: 10 }}>🎉 축하합니다!</Text>
          <Text style={{ fontSize: 16, color: '#374151', marginBottom: 20, textAlign: 'center' }}>{message || "메시지 로딩 중..."}</Text>
          <TouchableOpacity onPress={handleClosePress} style={{ backgroundColor: '#ec4899', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>닫기</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
