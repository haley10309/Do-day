import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function LoungeScreen() {
  const navigation = useNavigation();
  

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./img/lounge/lounge_background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* ⭐ 스타의 삶 버튼 */}
        <TouchableOpacity
          style={styles.starLifeBtn}
          onPress={() => navigation.navigate("Star")}
        />

        {/* 🔮 타로의 집 버튼 */}
        <TouchableOpacity
          style={styles.tarotBtn}
          onPress={() => navigation.navigate("Taro")}
        />

        {/* 🧠 두뇌 트레이닝 버튼 */}
        <TouchableOpacity
          style={styles.brainBtn}
          onPress={() => navigation.navigate("LevelTest")}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  /* === 버튼 터치 영역 ===
   * 아래 값들은 예시입니다. 기기 비율에 따라 조정 필요!
   * (가로: width 기준 비율, 세로: height 기준 비율로 위치 잡기)
   */
  starLifeBtn: {
    position: "absolute",
    top: height * 0.18,
    left: width * 0.2,
    width: width * 0.5,
    height: height * 0.08,
  },
  tarotBtn: {
    position: "absolute",
    top: height * 0.32,
    left: width * 0.55,
    width: width * 0.35,
    height: height * 0.08,
  },
  brainBtn: {
    position: "absolute",
    top: height * 0.5,
    left: width * 0.15,
    width: width * 0.6,
    height: height * 0.08,
  },
});
