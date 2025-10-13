import React, {useEffect} from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoScreen from '../screens/TodoScreen';
import LoungeScreen from '../screens/LoungeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import MyPageScreen from '../screens/MyPageScreen';

import nav_todo from './asset/nav_todo.png';
import nav_todo_not from './asset/nav_todo_not.png';
import nav_teams_not from './asset/nav_teams_not.png';
import nav_mypage from './asset/nav_mypage.png';
import nav_mypage_not from './asset/nav_mypage_not.png';
import nav_lounge from './asset/nav_lounge.png';
import nav_lounge_not from './asset/nav_lounge_not.png';
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function FloatingPlusButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        position: 'absolute',
        top: -36,
        alignSelf: 'center',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFB53A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
        zIndex: 10,
      }}
    >
      {/* 플러스 아이콘 */}
      <View style={{
        position: 'absolute', width: 28, height: 4, backgroundColor: '#fff',
        borderRadius: 2, left: '50%', top: '50%',
        transform: [{ translateX: -14 }, { translateY: -2 }],
      }} />
      <View style={{
        position: 'absolute', width: 4, height: 28, backgroundColor: '#fff',
        borderRadius: 2, left: '50%', top: '50%',
        transform: [{ translateX: -2 }, { translateY: -14 }],
      }} />
    </TouchableOpacity>
  );
}


export default function MainTabNavigator() {
  
  
  return (
    <Tab.Navigator
      initialRouteName="Todo"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 14,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 8,
        },
      }}
    >
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={focused ? nav_todo : nav_todo_not}
                style={{ width: 70, height: 70, resizeMode: 'contain' }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Lounge"
        component={LoungeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={focused ? nav_lounge : nav_lounge_not}
                style={{ width: 70, height: 70, resizeMode: 'contain' }}
              />
            </View>
          ),
        }}
      />

      {/* 중앙 플러스: 탭 전환 막고 이벤트만 보냄 */}
      <Tab.Screen
  name="PlusCenter"
  component={() => null}
  options={{
    tabBarButton: () => {
      const navigation = useNavigation(); // ✅ 여기서 직접 navigation 가져오기
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <FloatingPlusButton
            onPress={() => {
              // ✅ TodoScreen에 이벤트 전달 대신 직접 navigate 사용
              navigation.navigate('Todo', { openModal: true });
            }}
          />
        </View>
      );
    },
  }}
/>



      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={nav_teams_not} // 활성 아이콘 있으면 교체
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: 'contain',
                  opacity: focused ? 1 : 0.6,
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={focused ? nav_mypage : nav_mypage_not}
                style={{ width: 70, height: 70, resizeMode: 'contain' }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}