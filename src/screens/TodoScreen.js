// // App.js (아이폰 15 Plus 기준 리디자인 + 스와이프 삭제)

// import { 
//   StyleSheet, Text, TextInput, Button, View, ScrollView, Alert, Keyboard, 
//   KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Pressable,
//   Animated, // ★★★ Animated 임포트! ★★★
//   Dimensions // 화면 너비를 가져오기 위해 임포트
// } from "react-native";
// import LoadingOverlay from "../../components/LoadingOverlay";
// import { TodoProvider, useTodos } from "../../contexts/TodoContext";
// import CustomTodoModal from "../../components/CustomTodoModal";
// import CongratsMessage from "../../contexts/CongratsMessage";

// import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';



// function TodoScreen() { 
//   const [geminiInput, setGeminiInput] = useState("");
//   const [displayedGeminiInput, setDisplayedGeminiInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalTodoInput, setModalTodoInput] = useState("");
//   const [selectedTask, setSelectedTask] = useState(null); // ✅ 완료된 task 저장
//   const [showCongrats, setShowCongrats] = useState(false); // ✅ 모달 상태

//   const { todos, setTodos, toggleTodoCompletion, addTodo } = useTodos();
//   const SWIPE_THRESHOLD = -100; // 왼쪽으로 -100 이상 스와이프 시 삭제 버튼 노출


//   const MAC_IP_ADDRESS = "172.29.59.27";
//   const PORT = 5050;


//   const handleGeminiSubmit = async () => {
//     Keyboard.dismiss(); 
//     if (!geminiInput.trim()) {
//       Alert.alert("🤔 입력값이 없네요!", "Gemini에게 생성 요청할 목표를 입력해주세요.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(`http://${MAC_IP_ADDRESS}:${PORT}/generate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           answer: hardcodedSurveyResult, 
//           userRequest: geminiInput 
//         }),
//       });
//       const data = await response.json();
//       setTodos(data.todos);
//       setDisplayedGeminiInput(geminiInput); 
//       setGeminiInput(""); 
//     } catch (error) {
//       Alert.alert("🤯 To-do 리스트 생성 실패!", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const deleteTodo = (id) => {
//     setTodos(prev => prev.filter(todo => todo.id !== id));
//   };
//   const handleDelete = () => {
//     // Animate out
//     Animated.parallel([
//       Animated.timing(itemHeight, { toValue: 0, duration: 200, useNativeDriver: false }),
//       Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }),
//     ]).start(() => onDelete(todo.id));
//   };


//   const handleAddCustomTodoFromModal = () => {
//     Keyboard.dismiss();
//     if (!modalTodoInput.trim()) {
//       Alert.alert("😅 빈칸인데요?", "추가할 할 일을 입력해주세요.");
//       return;
//     }
//     addTodo(modalTodoInput);
//     setModalTodoInput("");
//     setIsModalVisible(false);
//   };
//   const handleToggleCompletion = (id) => {
//     // 기존 toggleTodoCompletion 로직
//     const updatedTodos = todos.map(todo => 
//       todo.id === id ? { ...todo, completed: !todo.completed } : todo
//     );
//     setTodos(updatedTodos); // Context API에 업데이트

//     // 만약 완료 상태로 바뀌었다면 축하 메시지 표시
//     const toggledTodo = updatedTodos.find(todo => todo.id === id);
//     if (toggledTodo && toggledTodo.completed) {
//       setSelectedTask(toggledTodo); // 완료된 To-do 저장
//       setShowCongrats(true);        // 축하 모달 표시
//     } else {
//         // 미완료로 바뀌면 축하 모달 숨김
//         setSelectedTask(null);
//         setShowCongrats(false);
//     }
//   };
//   // ★★★ 스와이프 삭제 로직을 위한 별도의 TodoItem 컴포넌트! ★★★
//   // 스와이프 관련 상태 (translateX)를 각 아이템별로 관리해야 해서 컴포넌트 분리.
//   const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
//     const translateX = useRef(new Animated.Value(0)).current; // 스와이프 애니메이션 값
//     const isSwiped = useRef(false); // 현재 스와이프 되어 있는지 (삭제 버튼 노출 여부)

//     // 제스처 핸들러
//     const onGestureEvent = Animated.event(
//       [{ nativeEvent: { translationX: translateX } }],
//       { useNativeDriver: true }
//     );

//     // 제스처 상태 변경 시 처리
//     const onHandlerStateChange = ({ nativeEvent }) => {
//       if (nativeEvent.oldState === State.ACTIVE) {
//         const { translationX } = nativeEvent;
  
//         if (translationX < SWIPE_THRESHOLD) {
//           // Snap left to show delete button
//           Animated.timing(translateX, {
//             toValue: -100, // delete button width
//             duration: 200,
//             useNativeDriver: true,
//           }).start();
//         } else {
//           // Return to original
//           Animated.timing(translateX, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//           }).start();
//         }
//       }
//     };

//     // 스와이프 후 다시 터치했을 때 닫히도록
//     const handlePressItem = () => {
//       if (isSwiped.current) {
//         Animated.spring(translateX, {
//           toValue: 0,
//           useNativeDriver: true,
//         }).start();
//         isSwiped.current = false;
//       } else {
//         onToggle(todo.id); // 완료 토글
//       }
//     };

//     return (
//       <View style={styles.swipeableContainer}>
//         {/* 삭제 버튼 영역 */}
//         <Pressable style={styles.deleteButton} onPress={() => onDelete(todo.id)}>
//           <Text style={styles.deleteButtonText}>삭제</Text>
//         </Pressable>
        

//         {/* PanGestureHandler로 스와이프 제스처 처리 */}
//         <PanGestureHandler
//           onGestureEvent={onGestureEvent}
//           onHandlerStateChange={onHandlerStateChange}
//           activeOffsetX={[-10, 10]} // 좌우 스와이프 모두 감지 (좌측 우선)
//           failOffsetX={[-10, 10]} // 수직 스크롤과 충돌 방지
//         >
//           <Animated.View style={[
//             styles.todoCardContent, // 스와이프 되는 내용
//             { transform: [{ translateX: translateX }] },
//             todo.completed && styles.todoCardCompleted
//           ]}>
//             <Pressable 
//               onPress={handlePressItem} // 스와이프 상태 고려하여 토글 또는 닫기
//               style={styles.todoCardInner}
//             >
//               <Text style={[
//                 styles.todoText, 
//                 todo.completed && styles.todoTextCompleted
//               ]}>
//                 {todo.completed ? '✅' : '⬜'} {todo.task}
//               </Text>
//             </Pressable>
//           </Animated.View>
//         </PanGestureHandler>
//       </View>
//     );
//   });

//   return (
//     <> 
//       <KeyboardAvoidingView 
//         style={{ flex: 1 }} 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.container}>
//             <Text style={styles.title}>📝 오늘의 맞춤형 To-do</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="예: 오늘 운동하기, 포트폴리오 만들기"
//               value={geminiInput}
//               onChangeText={setGeminiInput}
//               multiline={true}
//               numberOfLines={3}
//               placeholderTextColor="#aaa"
//             />
//             <Pressable style={styles.generateButton} onPress={handleGeminiSubmit}>
//               <Text style={styles.generateButtonText}>✨ AI To-do 생성</Text>
//             </Pressable>

//             <ScrollView style={styles.resultBox}>
//               {displayedGeminiInput ? ( 
//                 <View style={styles.displayedInputContainer}>
//                   <Text style={styles.displayedInputLabel}>📌 요청 목표</Text>
//                   <Text style={styles.displayedInputText}>{displayedGeminiInput}</Text>
//                   <Text style={styles.resultLabel}>📋 생성된 To-do</Text>
//                 </View>
//               ) : null}

//               {todos.length > 0 ? (
//                 todos.map((todo) => ( // ★★★ TodoItem 컴포넌트 렌더링! ★★★
//                   <TodoItem 
//                     key={todo.id} 
//                     todo={todo} 
//                     onToggle={handleToggleCompletion} 
//                     onDelete={deleteTodo} 
//                   />
//                 ))
//               ) : (
//                 <Text style={styles.emptyText}>
//                   아직 생성된 To-do가 없어요! ✨
//                 </Text>
//               )}
//             </ScrollView>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>

//       <Pressable style={styles.fab} onPress={() => setIsModalVisible(true)}>
//         <Text style={styles.fabText}>＋</Text>
//       </Pressable>
      
//       {isModalVisible && (
//         <CustomTodoModal
//           visible={true}
//           value={modalTodoInput}
//           onChangeText={setModalTodoInput}
//           onCancel={() => {
//             setIsModalVisible(false);
//             setModalTodoInput("");
//           }}
//           onAdd={handleAddCustomTodoFromModal}
//         />
//       )}

//       {showCongrats && selectedTask && (
//         <CongratsMessage
//         surveyResult={hardcodedSurveyResult}
//         task={selectedTask}
//         onClose={() => setShowCongrats(false)}
//         macIpAddress={MAC_IP_ADDRESS}
//         port={PORT}
//       />      
//       )}

//       <LoadingOverlay 
//         visible={isLoading} 
//         message="Gemini가 To-do 리스트를 멋지게 만드는 중..." 
//       />
//     </>
//   );
// }

// export default function App() {
//   return (
//     <TodoProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <TodoScreen />
//       </GestureHandlerRootView>
//     </TodoProvider>
//   );
// }


// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fdfdfd", 
//     paddingHorizontal: 20, 
//     paddingTop: 60 
//   },
//   title: { 
//     fontSize: 26, 
//     fontWeight: "700", 
//     marginBottom: 20, 
//     textAlign: "center", 
//     color: "#222" 
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 15,
//     minHeight: 80,
//     textAlignVertical: 'top',
//     fontSize: 16,
//     backgroundColor: "#fafafa"
//   },
//   generateButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginBottom: 20,
//     alignItems: "center",
//     shadowColor: "#007AFF",
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//   },
//   generateButtonText: {
//     color: "white",
//     fontWeight: "600",
//     fontSize: 17,
//   },
//   resultBox: {
//     flex: 1,
//     marginTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingTop: 10,
//   },
//   displayedInputContainer: { 
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   displayedInputLabel: { 
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 5,
//   },
//   displayedInputText: { 
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   resultLabel: { 
//     fontSize: 14,
//     color: '#007AFF',
//     marginBottom: 5,
//   },
//   todoCard: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   todoCardCompleted: {
//     backgroundColor: "#e8f0ff",
//   },
//   todoText: { 
//     fontSize: 16, 
//     color: "#333" 
//   },
//   todoTextCompleted: {
//     textDecorationLine: 'line-through',
//     color: "#888"
//   },
//   emptyText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#aaa",
//     marginTop: 20
//   },
//   fab: {
//     position: 'absolute',
//     width: 64,
//     height: 64,
//     alignItems: 'center',
//     justifyContent: 'center',
//     right: 30,
//     bottom: 40,
//     backgroundColor: '#007AFF',
//     borderRadius: 32,
//     shadowColor: '#007AFF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//   },
//   fabText: {
//     fontSize: 34,
//     color: 'white',
//     fontWeight: '700',
//   },
// });
// App.js
// --------------------------------(상단)gemini 연결 --------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Keyboard,
  Alert,
  ActivityIndicator,
  InteractionManager
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import CustomTodoModal from "../../components/CustomTodoModal.js";
import todo_background_img_1 from "./img/home/todo_background_img_1.png";
import shopIcon from "./img/home/shop_icon.png";
import characterWalk from "./img/home/character_walk.png"; 
import coinIcon1 from "./img/home/coin_icon1.png";
import settingIcon from "./img/home/setting_icon.png";
import CongratsMessage from "../../contexts/CongratsMessage.js";



//const [completedTask, setCompletedTask] = useState(null);
const surveyResult = {
  age: "26세",
  gender: "여성",
  status: "1회 인턴십 수행, 취업 준비 1년",
  mentality: "불안",
};
  // ✅ 축하 메시지 상태 추가

// const [congratsMessage, setCongratsMessage] = useState("");
const SCREEN_WIDTH = Dimensions.get("window").width;


export default function TodoOfficeScreen({ navigation, route }) {
  const MAC_IP_ADDRESS = '192.168.11.16';
  const PORT = 8081;

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // ✅ 완료된 task 저장
  const [showCongrats, setShowCongrats] = useState(false);
  // 모달 상태/입력값
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTodoInput, setModalTodoInput] = useState('');

  // 중앙 플러스에서 보낸 이벤트 구독
  useEffect(() => {
    const sub = navigation.addListener('openAddTodoModal', () => {
      setIsModalVisible(true);
    });
    return sub;
  }, [navigation]);

  // 라우트 파라미터로 모달 열기(옵션)
  useEffect(() => {
    if (route?.params?.openModal) {
      setIsModalVisible(true);
    }
  }, [route?.params]);

  // todos에 항목 추가 (입력값을 인자로 받는 방식으로 통일)
  const handleAddTodo = () => {
    if (todoText.trim() === "") return;
    setTodos([...todos, todoText]);
    setTodoText("");
    setIsModalVisible(false); // 모달 닫기
  };

  const handleCancel = () => {
    setTodoText("");
    setIsModalVisible(false);
  };

  // 모달에서 추가 버튼 핸들러
  const handleAddCustomTodoFromModal = () => {
    if (!modalTodoInput.trim()) {
      Alert.alert('😅 빈칸인데요?', '추가할 할 일을 입력해주세요.');
      return;
    }
  
    const newTodo = {
      id: Date.now().toString(), // 간단한 고유 id
      text: modalTodoInput,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setModalTodoInput('');
    setIsModalVisible(false);
  };
  
  
  
  const handleToggleCompletion = (id) => {
    setTodos(prev => {
      // id 타입 통일
      const targetId = String(id);
      const updated = prev.map(t =>
        String(t.id) === targetId ? { ...t, completed: !t.completed } : t
      );
  
      const toggled = updated.find(t => String(t.id) === targetId);
      if (toggled && toggled.completed) {
        setSelectedTask(toggled);
        setShowCongrats(true);
      } else {
        setSelectedTask(null);
        setShowCongrats(false);
      }
      return updated;
    });
  };
  

  
  // 1) 마운트 시 더미 API 호출해서 todos 교체
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError("");

        
        const res = await fetch(`http://${MAC_IP_ADDRESS}:${PORT}/generate`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();

        // 2) task -> text로 매핑
        const mapped = (data.todos || []).map((t) => ({
          id: t.id,
          text: t.task,       // 백엔드의 task 필드를 프론트의 text로
          completed: !!t.completed,
        }));

        // 3) 기존 하드코딩 대신 서버 값으로 교체
        setTodos(mapped);
      } catch (e) {
        setError(e.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const SWIPE_THRESHOLD = -100;



  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };
  const translateRefs = useRef({});

const TodoItem = React.memo(({ todo }) => {
  if (!translateRefs.current[todo.id]) {
    translateRefs.current[todo.id] = new Animated.Value(0);
  }
  const translateX = translateRefs.current[todo.id];

  const resetPosition = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleToggle = () => {
    // swipe 위치 초기화
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 애니메이션 끝난 후 안전하게 상태 업데이트
      InteractionManager.runAfterInteractions(() => {
        handleToggleCompletion(todo.id);
      });
    });
  };
  

  return (
    <View style={styles.todoItemWrapper}>
      <View style={styles.deleteButtonWrapper}>
        <TouchableOpacity
          onPress={() => deleteTodo(todo.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>

      <PanGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationX: translateX } }],
          { useNativeDriver: true }
        )}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.oldState === State.ACTIVE) {
            Animated.timing(translateX, {
              toValue: nativeEvent.translationX < -100 ? -100 : 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        }}
      >
        <Animated.View
          style={[
            styles.todoItem,
            { transform: [{ translateX }], backgroundColor: todo.completed ? "#e3f6d4" : "#fffaf3" },
          ]}
        >
          <TouchableOpacity
              onPress={handleToggle}  // 직접 handleToggle 호출
              activeOpacity={0.7}
              style={styles.todoContent}
            >
              <View style={[styles.checkCircle, todo.completed && styles.checkCircleActive]}>
                {todo.completed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
                {todo.text}
              </Text>
            </TouchableOpacity>

        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});


  const completed = todos.filter((t) => t.completed).length;
  const progress = Math.floor((completed / todos.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
    {/* 상단 배경 */}
    <View style={styles.officeImageWrapper}>
    <ImageBackground
  source={todo_background_img_1}
  style={styles.officeBackground}
  resizeMode="cover"
>
  {/* 상단 아이콘들 - absolute로 배경 위에 고정 */}
  <View style={styles.topIcons}>
    <View style={styles.coinBox}>
      <Image source={coinIcon1} style={styles.coinIcon} />
      {/* <Text style={styles.coinText}>120</Text> */}
    </View>
    <TouchableOpacity>
      <Image source={settingIcon} style={styles.settingIcon} />
    </TouchableOpacity>
  </View>

  {/* 캐릭터 */}
  <Image source={characterWalk} style={styles.character} />

  {/* 상점 버튼 */}
  <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("Shop")}>
    <Image source={shopIcon} style={styles.shopIcon} />
  </TouchableOpacity>

</ImageBackground>

    </View>

    {/* 투두 영역 */}
    <View style={styles.todoSection}>
      <Text style={styles.dateText}>10월 9일</Text>
      <Text style={styles.progressText}>
        투두 현황 {completed} / {todos.length} {progress}%
      </Text>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      
    </View>
  </ScrollView>
  {/* ✅ 축하 메시지 모달 */}
  
  <CongratsMessage
  visible={showCongrats}
  task={selectedTask}
  onClose={() => {
    setShowCongrats(false);
    setSelectedTask(null);
  }}
  macIpAddress={MAC_IP_ADDRESS}
  port={PORT}
/>
  <CustomTodoModal
  visible={isModalVisible}
  value={modalTodoInput}
  onChangeText={setModalTodoInput}
  onCancel={() => setIsModalVisible(false)}
  onAdd={handleAddCustomTodoFromModal}
/>


</SafeAreaView>

  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf4e9",
    //paddingHorizontal: 0, // 기존 20에서 0으로 변경해두면 이미지도 딱 붙음
  },
  topBar: {
    position: "absolute",
    top: 40,             // 안전 여백 (SafeArea 고려)
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,          // 배경 위로
  },
  topIcons: {
    position: "absolute",
    top: 20, // 상단에서 약간 띄움
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  
  
  coinBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 70,
    height: 28,
    // marginRight: 6,
  },
  coinText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7a5a2f",
  },
  settingIcon: {
    width: 22,
    height: 22,
    tintColor: "#7a5a2f",
  },
  officeImageWrapper: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    marginBottom: 16,
  },
  officeBackground: {
    width: SCREEN_WIDTH,
    height: 400,
    justifyContent: "flex-end", // 하단 요소(캐릭터, 상점버튼)는 아래 정렬
    position: "relative",       // 내부 absolute 요소 기준이 되게 함
  },
  character: {
    width: 150,
    height: 150,
    position: "absolute",
    bottom: 10,
    left: "5%",
    resizeMode: "contain",
  },
  shopButton: {
    position: "absolute",
    right: 10,
    bottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 6,
    borderRadius: 8,
  },
  shopIcon: {
    // width: 28,
    // height: 28,
    //tintColor: "#7a5a2f",
    resizeMode: "contain",
  },
  officeImage: {
    width: SCREEN_WIDTH,
    height: 220,
    resizeMode: "cover",  // 좌우 꽉 찰 때 best
  },
  todoSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: -20, // 배경과 자연스럽게 이어지게
  },
  dateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4a3b28",
  },
  progressText: {
    fontSize: 14,
    color: "#8b7760",
    marginTop: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f1e0c6",
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#f5b942",
    borderRadius: 4,
  },
  todoList: {
    marginTop: 6,
  },
  todoItemWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  deleteButtonWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#ffb3b3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  deleteButton: {
    backgroundColor: "#ff7070",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  todoItem: {
    backgroundColor: "#fff7e8",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d7c3a1",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleActive: {
    backgroundColor: "#f5b942",
    borderColor: "#f5b942",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  todoText: {
    fontSize: 16,
    color: "#5b4730",
  },
  todoTextCompleted: {
    color: "#5b4730",
    textDecorationLine: "none",
    fontWeight: "700",
  },

});
