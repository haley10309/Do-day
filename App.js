// App.js (아이폰 15 Plus 기준 리디자인 + 스와이프 삭제)
import React, { useState, useRef } from "react"; // ★★★ useRef 임포트! ★★★
import { 
  StyleSheet, Text, TextInput, Button, View, ScrollView, Alert, Keyboard, 
  KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Pressable,
  Animated, // ★★★ Animated 임포트! ★★★
  Dimensions // 화면 너비를 가져오기 위해 임포트
} from "react-native";
import LoadingOverlay from './components/LoadingOverlay';
import { TodoProvider, useTodos } from './contexts/TodoContext'; 
import CustomTodoModal from "./components/CustomTodoModal";
import CongratsMessage from "./contexts/CongratsMessage"; // 경로 확인

import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';



function MainTodoApp() { 
  const [geminiInput, setGeminiInput] = useState("");
  const [displayedGeminiInput, setDisplayedGeminiInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTodoInput, setModalTodoInput] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // ✅ 완료된 task 저장
  const [showCongrats, setShowCongrats] = useState(false); // ✅ 모달 상태

  const { todos, setTodos, toggleTodoCompletion, addTodo } = useTodos();
  const SWIPE_THRESHOLD = -100; // 왼쪽으로 -100 이상 스와이프 시 삭제 버튼 노출


  const MAC_IP_ADDRESS = "192.168.11.8";
  const PORT = 5050;

  const hardcodedSurveyResult = `
<설문조사 결과>
1. 알림 방식: 필요한 순간마다 꼼꼼히 받고 싶음
2. 앱 사용 시간대: 저녁, 하루를 마무리하며
3. 스트레스 상태: 종종 쌓이곤 함, 관리가 필요함
4. 무기력함 빈도: 가끔은 있음
5. 평균 수면 시간: 6~7시간 정도 (보통 잘 자는 편)
6. 목표 실천 자신감: 대부분 해낼 수 있지만 가끔 흔들림
7. 집중력 유지 시간: 1~2시간 정도
8. 운동 습관: 산책이나 가벼운 활동 가끔 함
9. 에너지 회복 방법: 음악 감상, 혼자 조용히 쉬기
10. 취업 준비 기간: 3~12개월 준비 중
11. 현재 집중하는 취업 준비: 포트폴리오 만들기, 자기소개서 다듬기
12. 관심 직무 분야: IT/개발
<설문조사 끝>
  `.trim();

  

  const handleGeminiSubmit = async () => {
    Keyboard.dismiss(); 
    if (!geminiInput.trim()) {
      Alert.alert("🤔 입력값이 없네요!", "Gemini에게 생성 요청할 목표를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://${MAC_IP_ADDRESS}:${PORT}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answer: hardcodedSurveyResult, 
          userRequest: geminiInput 
        }),
      });
      const data = await response.json();
      setTodos(data.todos);
      setDisplayedGeminiInput(geminiInput); 
      setGeminiInput(""); 
    } catch (error) {
      Alert.alert("🤯 To-do 리스트 생성 실패!", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  const handleDelete = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(itemHeight, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start(() => onDelete(todo.id));
  };


  const handleAddCustomTodoFromModal = () => {
    Keyboard.dismiss();
    if (!modalTodoInput.trim()) {
      Alert.alert("😅 빈칸인데요?", "추가할 할 일을 입력해주세요.");
      return;
    }
    addTodo(modalTodoInput);
    setModalTodoInput("");
    setIsModalVisible(false);
  };
  const handleToggleCompletion = (id) => {
    // 기존 toggleTodoCompletion 로직
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos); // Context API에 업데이트

    // 만약 완료 상태로 바뀌었다면 축하 메시지 표시
    const toggledTodo = updatedTodos.find(todo => todo.id === id);
    if (toggledTodo && toggledTodo.completed) {
      setSelectedTask(toggledTodo); // 완료된 To-do 저장
      setShowCongrats(true);        // 축하 모달 표시
    } else {
        // 미완료로 바뀌면 축하 모달 숨김
        setSelectedTask(null);
        setShowCongrats(false);
    }
  };
  // ★★★ 스와이프 삭제 로직을 위한 별도의 TodoItem 컴포넌트! ★★★
  // 스와이프 관련 상태 (translateX)를 각 아이템별로 관리해야 해서 컴포넌트 분리.
  const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
    const translateX = useRef(new Animated.Value(0)).current; // 스와이프 애니메이션 값
    const isSwiped = useRef(false); // 현재 스와이프 되어 있는지 (삭제 버튼 노출 여부)

    // 제스처 핸들러
    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    // 제스처 상태 변경 시 처리
    const onHandlerStateChange = ({ nativeEvent }) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        const { translationX } = nativeEvent;
  
        if (translationX < SWIPE_THRESHOLD) {
          // Snap left to show delete button
          Animated.timing(translateX, {
            toValue: -100, // delete button width
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          // Return to original
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    // 스와이프 후 다시 터치했을 때 닫히도록
    const handlePressItem = () => {
      if (isSwiped.current) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        isSwiped.current = false;
      } else {
        onToggle(todo.id); // 완료 토글
      }
    };

    return (
      <View style={styles.swipeableContainer}>
        {/* 삭제 버튼 영역 */}
        <Pressable style={styles.deleteButton} onPress={() => onDelete(todo.id)}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </Pressable>
        

        {/* PanGestureHandler로 스와이프 제스처 처리 */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-10, 10]} // 좌우 스와이프 모두 감지 (좌측 우선)
          failOffsetX={[-10, 10]} // 수직 스크롤과 충돌 방지
        >
          <Animated.View style={[
            styles.todoCardContent, // 스와이프 되는 내용
            { transform: [{ translateX: translateX }] },
            todo.completed && styles.todoCardCompleted
          ]}>
            <Pressable 
              onPress={handlePressItem} // 스와이프 상태 고려하여 토글 또는 닫기
              style={styles.todoCardInner}
            >
              <Text style={[
                styles.todoText, 
                todo.completed && styles.todoTextCompleted
              ]}>
                {todo.completed ? '✅' : '⬜'} {todo.task}
              </Text>
            </Pressable>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  });

  return (
    <> 
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>📝 오늘의 맞춤형 To-do</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 오늘 운동하기, 포트폴리오 만들기"
              value={geminiInput}
              onChangeText={setGeminiInput}
              multiline={true}
              numberOfLines={3}
              placeholderTextColor="#aaa"
            />
            <Pressable style={styles.generateButton} onPress={handleGeminiSubmit}>
              <Text style={styles.generateButtonText}>✨ AI To-do 생성</Text>
            </Pressable>

            <ScrollView style={styles.resultBox}>
              {displayedGeminiInput ? ( 
                <View style={styles.displayedInputContainer}>
                  <Text style={styles.displayedInputLabel}>📌 요청 목표</Text>
                  <Text style={styles.displayedInputText}>{displayedGeminiInput}</Text>
                  <Text style={styles.resultLabel}>📋 생성된 To-do</Text>
                </View>
              ) : null}

              {todos.length > 0 ? (
                todos.map((todo) => ( // ★★★ TodoItem 컴포넌트 렌더링! ★★★
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={handleToggleCompletion} 
                    onDelete={deleteTodo} 
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  아직 생성된 To-do가 없어요! ✨
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Pressable style={styles.fab} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
      
      {isModalVisible && (
        <CustomTodoModal
          visible={true}
          value={modalTodoInput}
          onChangeText={setModalTodoInput}
          onCancel={() => {
            setIsModalVisible(false);
            setModalTodoInput("");
          }}
          onAdd={handleAddCustomTodoFromModal}
        />
      )}

      {showCongrats && selectedTask && (
        <CongratsMessage
        surveyResult={hardcodedSurveyResult}
        task={selectedTask}
        onClose={() => setShowCongrats(false)}
        macIpAddress={MAC_IP_ADDRESS}
        port={PORT}
      />      
      )}

      <LoadingOverlay 
        visible={isLoading} 
        message="Gemini가 To-do 리스트를 멋지게 만드는 중..." 
      />
    </>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainTodoApp />
      </GestureHandlerRootView>
    </TodoProvider>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fdfdfd", 
    paddingHorizontal: 20, 
    paddingTop: 60 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "700", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#222" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: "#fafafa"
  },
  generateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  generateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 17,
  },
  resultBox: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  displayedInputContainer: { 
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  displayedInputLabel: { 
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  displayedInputText: { 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  resultLabel: { 
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  todoCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  todoCardCompleted: {
    backgroundColor: "#e8f0ff",
  },
  todoText: { 
    fontSize: 16, 
    color: "#333" 
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: "#888"
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
    marginTop: 20
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 40,
    backgroundColor: '#007AFF',
    borderRadius: 32,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 34,
    color: 'white',
    fontWeight: '700',
  },
});
