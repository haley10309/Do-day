import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import todo_background_img_1 from "./img/home/todo_background_img_1.png";
import characterWalk from "./img/home/character_walk.png";
import coinIcon1 from "./img/home/coin_icon1.png";
import settingIcon from "./img/home/setting_icon.png";

import shop_decoration from "./img/shop/shop_decoration.png";
import shop_decoration_not from "./img/shop/shop_decoration_not.png";
import shop_electronics from "./img/shop/shop_electronics.png";
import shop_electronics_not from "./img/shop/shop_electronics_not.png";
import shop_furniture from "./img/shop/shop_furniture.png";
import shop_furniture_not from "./img/shop/shop_furniture_not.png";
import shop_office from "./img/shop/shop_office.png";
import shop_office_not from "./img/shop/shop_office_not.png";

import shop_item_decoration from "./img/shop/shop_item_decoration.png";
import shop_item_electronics from "./img/shop/shop_item_electronics.png";
import shop_item_furniture from "./img/shop/shop_item_furniture.png";
import shop_item_office from "./img/shop/shop_item_office.png";

export default function ShopScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("furniture");

  const tabData = [
    { id: "furniture", icon: shop_furniture, icon_not: shop_furniture_not },
    { id: "electronics", icon: shop_electronics, icon_not: shop_electronics_not },
    { id: "decoration", icon: shop_decoration, icon_not: shop_decoration_not },
    { id: "office", icon: shop_office, icon_not: shop_office_not },
  ];

  const itemImages = {
    furniture: shop_item_furniture,
    electronics: shop_item_electronics,
    decoration: shop_item_decoration,
    office: shop_item_office,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 배경 */}
      <View style={styles.headerWrapper}>
        <ImageBackground source={todo_background_img_1} style={styles.background} resizeMode="cover">
          <View style={styles.topIcons}>
            <View style={styles.coinBox}>
              <Image source={coinIcon1} style={styles.coinIcon} />
              
            </View>
            <TouchableOpacity>
              <Image source={settingIcon} style={styles.settingIcon} />
            </TouchableOpacity>
          </View>
          <Image source={characterWalk} style={styles.character} />
        </ImageBackground>
      </View>

      {/* 탭 버튼 (이미지 전환용) */}
      <View style={styles.shopTabs}>
        {tabData.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSelectedTab(tab.id)}
            activeOpacity={0.8}
          >
            <Image
              source={selectedTab === tab.id ? tab.icon : tab.icon_not}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 선택된 탭의 한 장짜리 아이템 이미지 */}
      <View style={styles.itemContainer}>
        <Image
          source={itemImages[selectedTab]}
          style={styles.itemImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7E5" },
  headerWrapper: { height: 300 },
  background: { flex: 1, justifyContent: "flex-end" },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  coinBox: { flexDirection: "row", alignItems: "center" },
  coinIcon: { width: 60, height: 25, marginRight: 5 },
  settingIcon: { width: 24, height: 24 },
  character: { width: 80, height: 80, position: "absolute", bottom: 10, left: 20 },

  shopTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF7E5",
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabIcon: {
    width: 70,
    height: 50,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  itemImage: {
    width: "90%",
    height: 400,
  },
});
