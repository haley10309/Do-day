// App.js (최종 리팩토링 버전)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TodoProvider } from './contexts/TodoContext';

import MainTabNavigator from './src/navigation/MainTabNavigator'; // ★★★ 경로 수정 ★★★
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ★★★ 임포트! ★★★

export default function App() {
  return (
    // ★★★ 모든 제스처를 제대로 인식하도록 최상위 컴포넌트를 GestureHandlerRootView로 감싸기 ★★★
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TodoProvider> 
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      </TodoProvider>
    </GestureHandlerRootView>
  );
}

// ★★★ 이 파일에는 더 이상 Stylesheet나 다른 로직이 없습니다! ★★★