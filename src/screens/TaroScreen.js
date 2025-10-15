import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

// 카드 크기 (241x458 비율 유지)
const BASE_CARD_WIDTH = 241;
const BASE_CARD_HEIGHT = 458;
const SCALE = Math.min(0.5, (width - 80) / (BASE_CARD_WIDTH * 5)); // 5장이 들어가도록 축소
const CARD_WIDTH = BASE_CARD_WIDTH * SCALE;
const CARD_HEIGHT = BASE_CARD_HEIGHT * SCALE;

const initialCards = [
  { id: "1", front: require("./img/taro/pic1.png") },
  { id: "2", front: require("./img/taro/pic2.png") },
  { id: "3", front: require("./img/taro/pic3.png") },
  { id: "4", front: require("./img/taro/pic4.png") },
  { id: "5", front: require("./img/taro/pic5.png") },
];

const cardBackImage = require("./img/taro/card-back.png");

function FlippableCard({ card, animatedValue, index, onPress, rotation }) {
  const rotateY = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const rotateYBack = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <TouchableWithoutFeedback onPress={() => onPress(index)}>
      <View
        style={[
          styles.cardContainer,
          {
            transform: [{ rotate: `${rotation}deg` }],
          },
        ]}
      >
        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ perspective: 1000 }, { rotateY }],
            },
          ]}
        >
          <Image source={cardBackImage} style={styles.cardImage} resizeMode="cover" />
        </Animated.View>

        {/* Front */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              position: "absolute",
              top: 0,
              left: 0,
              transform: [{ perspective: 1000 }, { rotateY: rotateYBack }],
            },
          ]}
        >
          <Image source={card.front} style={styles.cardImage} resizeMode="cover" />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function Taro() {
  const [cards] = useState(initialCards);
  const animValsRef = useRef(cards.map(() => new Animated.Value(0))).current;
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]); // 슬롯에 올라간 카드
  

  const flipCard = (index) => {
    if (flippedIndex === index) {
      Animated.timing(animValsRef[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFlippedIndex(null));
      return;
    }

    if (flippedIndex !== null && flippedIndex !== index) {
      Animated.timing(animValsRef[flippedIndex], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    Animated.timing(animValsRef[index], {
      toValue: 180,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFlippedIndex(index));
  };

  // 카드 배치 각도 (부채꼴 형태)
  const rotations = [-20, -10, 0, 10, 20];

  return (
    <View style={styles.screen}>
      {/* 상단 타이틀 */}
      <Text style={styles.title}>타로의 집</Text>

      {/* 빈 슬롯 (점선 박스) */}
      <View style={styles.slotsContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.slotBox} />
        ))}
      </View>

      {/* 부채꼴 카드 */}
      <View style={styles.cardFanContainer}>
        {cards.map((card, i) => (
          <FlippableCard
            key={card.id}
            card={card}
            animatedValue={animValsRef[i]}
            index={i}
            onPress={flipCard}
            rotation={rotations[i] || 0}
          />
        ))}
      </View>

      {/* 버튼 */}
      <TouchableOpacity style={styles.bottomButton} onPress={() => alert("해석 확인하기")}>
        <Text style={styles.buttonText}>해석 확인하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#b2e68d", // 녹색 언덕 느낌
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#3a1f2b",
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 12,
  },
  slotBox: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 0.8,
    borderWidth: 2,
    borderColor: "#aaa",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  cardFanContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 40,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: -4, // 살짝 겹치게
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#3a1f2b",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cardFront: {},
  cardImage: {
    width: "100%",
    height: "100%",
  },
  bottomButton: {
    width: "90%",
    height: 48,
    backgroundColor: "#3a1f2b",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
