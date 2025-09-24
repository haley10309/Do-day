// src/navigation/MainTabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// 각 화면 컴포넌트 임포트
import TodoScreen from '../screens/TodoScreen';
import LoungeScreen from '../screens/LoungeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      // ★★★★★ 여기를 수정! ★★★★★
      initialRouteName="Todo" // <--- 'Todo' 탭을 기본 화면으로 설정!
      // ★★★★★ 여기까지 ★★★★★

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Todo') {
            iconName = focused ? 'checkbox-sharp' : 'checkbox-outline';
          } else if (route.name === 'Lounge') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Teams') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9333EA', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: { 
          height: 90, 
          paddingTop: 10, 
          paddingBottom: 25, 
          backgroundColor: '#fff',
          borderTopWidth: 0, 
          elevation: 5, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerShown: true, 
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#4A2A80',
        },
        headerShadowVisible: false, 
      })}
    >
      <Tab.Screen name="Todo" component={TodoScreen} options={{ title: '할 일' }} />
      <Tab.Screen name="Lounge" component={LoungeScreen} options={{ title: '라운지' }} />
      <Tab.Screen name="Teams" component={TeamsScreen} options={{ title: '팀' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이' }} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;