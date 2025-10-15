import React from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import todo_background_img_1 from "./img/home/todo_background_img_1.png";
import characterWalk from "./img/home/character_walk.png";
import coinIcon1 from "./img/home/coin_icon1.png";
import settingIcon from "./img/home/setting_icon.png";

export default function ShopScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* 상단 배경 */}
        <View style={styles.headerWrapper}>
          <ImageBackground
            source={todo_background_img_1}
            style={styles.background}
            resizeMode="cover"
          >
            {/* 상단 아이콘들 */}
            <View style={styles.topIcons}>
              <View style={styles.coinBox}>
                <Image source={coinIcon1} style={styles.coinIcon} />
                <Text style={styles.coinText}>120</Text>
              </View>
              <TouchableOpacity>
                <Image source={settingIcon} style={styles.settingIcon} />
              </TouchableOpacity>
            </View>

            {/* 캐릭터 */}
            <Image source={characterWalk} style={styles.character} />
          </ImageBackground>
        </View>

        {/* 상점 내용 영역 */}
        <View style={styles.shopContent}>
          <Text style={styles.title}>🛍️ 상점</Text>
          {/* 여기에 나중에 아이템 리스트, 구매 버튼 등 추가 */}
          <Text style={styles.placeholder}>상점 아이템이 여기에 표시됩니다.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    headerWrapper: { height: 300 },
    background: { flex: 1, justifyContent: "flex-end" },
    topIcons: { flexDirection: "row", justifyContent: "space-between", padding: 15, position: "absolute", top: 0, width: "100%" },
    coinBox: { flexDirection: "row", alignItems: "center" },
    coinIcon: { width: 24, height: 24, marginRight: 5 },
    coinText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
    settingIcon: { width: 24, height: 24 },
    character: { width: 80, height: 80, position: "absolute", bottom: 10, left: 20 },
    shopContent: { padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    placeholder: { fontSize: 16, color: "#555" },
  });