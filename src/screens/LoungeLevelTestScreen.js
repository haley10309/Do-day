import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

export default function LoungeLevelTestScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./img/lounge/lounge_level_test.png")}
        style={styles.background}
        resizeMode="cover" // 이미지를 꽉 채우기
      />
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
});
