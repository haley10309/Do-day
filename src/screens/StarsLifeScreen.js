import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const celebrities = [
  {
    id: "1",
    name: "오타니 쇼헤이",
    job: "일본 출신 메이저리그 야구선수",
    image: require("./img/star/otani_icon.png"),
    todos: [
      "아침 6시 기상하기",
      "10km 아침 조깅 가기",
      "웨이트 훈련하기",
      "독서 10분 이상 하기",
    ],
  },
  {
    id: "2",
    name: "드웨인 존슨",
    job: "할리우드 배우 / 전 프로레슬러",
    image: require("./img/star/dwayne_icon.png"),
    todos: [
      "새벽 4시 헬스장 가기",
      "닭가슴살 식단 지키기",
      "가족과 시간 보내기",
    ],
  },
  {
    id: "3",
    name: "팀 쿡",
    job: "애플 최고 경영 전략가",
    image: require("./img/star/tim_icon.png"),
    todos: [
      "새벽 3시 45분 기상",
      "이메일 확인하기",
      "명상 10분 하기",
    ],
  },
  {
    id: "4",
    name: "무라카미 하루키",
    job: "일본 소설가",
    image: require("./img/star/murakami_icon.png"),
    todos: [
      "소설 집필 4시간",
      "조깅 10km",
      "클래식 음악 듣기",
    ],
  },
];

export default function StarLifeScreen() {
  // ⭐️ 여기가 변경된 부분이야! celebrities 배열의 첫 번째 요소 id로 초기화해줘.
  const [expanded, setExpanded] = useState(celebrities[0].id); // '1' 대신 이렇게 해주면 celebrities 배열이 바뀌어도 유연하게 대응 가능!

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

 const renderCelebrity = ({ item }) => {
    const isExpanded = expanded === item.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
          <View style={styles.header}>
            <Image source={item.image} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.job}>{item.job}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.todoContainer}>
            {item.todos.map((todo, index) => (
              <View key={index} style={styles.todoItem}>
                <Text style={styles.todoText}>{todo}</Text>
                <TouchableOpacity style={styles.plusButton}>
                  <Text style={styles.plusText}>＋</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>도전 스타의 삶</Text>
      <FlatList
        data={celebrities}
        renderItem={renderCelebrity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf1db", // 전체 배경
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B3A2A",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fcf5ed", // 셀럽 카드
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 25,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  job: {
    fontSize: 13,
    color: "#666",
  },
  todoContainer: {
    marginTop: 12,
  },
  todoItem: {
    backgroundColor: "#ffeac8", // 투두 항목
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "#4B3A2A",
    fontSize: 14,
  },
  plusButton: {
    backgroundColor: "#ffb744", // 주황색 원
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    color: "#fff", // 흰색 플러스
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
  },
});