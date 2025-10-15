import React from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";

import TodoScreen from '../screens/TodoScreen';
import ShopScreen from '../screens/ShopScreen';
import LoungeScreen from '../screens/LoungeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import MyPageScreen from '../screens/MyPageScreen';
import TaroScreen from '../screens/TaroScreen';
import LoungeLevelTestScreen from '../screens/LoungeLevelTestScreen';
import StarLifeScreen from '../screens/StarsLifeScreen';

import nav_todo from './asset/nav_todo.png';
import nav_todo_not from './asset/nav_todo_not.png';
import nav_teams from './asset/nav_teams.png';
import nav_teams_not from './asset/nav_teams_not.png';
import nav_mypage from './asset/nav_mypage.png';
import nav_mypage_not from './asset/nav_mypage_not.png';
import nav_lounge from './asset/nav_lounge.png';
import nav_lounge_not from './asset/nav_lounge_not.png';

const Tab = createBottomTabNavigator();
const TodoStack = createNativeStackNavigator();

// ------------------- Todo Stack Navigator -------------------
function TodoStackNavigator() {
  return (
    <TodoStack.Navigator screenOptions={{ headerShown: false }}>
      <TodoStack.Screen name="TodoMain" component={TodoScreen} />
      <TodoStack.Screen name="Shop" component={ShopScreen} />
      <TodoStack.Screen name="Star" component={StarLifeScreen} />
      <TodoStack.Screen name="Taro" component={TaroScreen} />
      <TodoStack.Screen name="LevelTest" component={LoungeLevelTestScreen} />
      <TodoStack.Screen name="Lounge" component={LoungeScreen} />

    </TodoStack.Navigator>
  );
}
// ------------------- Lounge Stack Navigator -------------------
const LoungeStack = createNativeStackNavigator();

function LoungeStackNavigator() {
  return (
    <LoungeStack.Navigator screenOptions={{ headerShown: false }}>
      <LoungeStack.Screen name="LoungeMain" component={LoungeScreen} />
      <LoungeStack.Screen name="Star" component={StarLifeScreen} />
      <LoungeStack.Screen name="Taro" component={TaroScreen} />
      <LoungeStack.Screen name="LevelTest" component={LoungeLevelTestScreen} />
    </LoungeStack.Navigator>
  );
}


// ------------------- Floating Plus Button -------------------
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

// ------------------- Main Tab Navigator -------------------
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
      {/* ---------------- Todo Tab ---------------- */}
      <Tab.Screen
        name="Todo"
        component={TodoStackNavigator}
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

      {/* ---------------- Lounge Tab ---------------- */}
      <Tab.Screen
        name="Lounge"
        component={LoungeStackNavigator}
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

      {/* ---------------- Central Plus Button ---------------- */}
      <Tab.Screen
        name="PlusCenter"
        component={() => null}
        options={{
          tabBarButton: () => {
            const navigation = useNavigation();
            return (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <FloatingPlusButton
                  onPress={() => {
                    navigation.navigate('Todo', {
                      screen: 'TodoMain',      // Stack 내부 스크린
                      params: { openModal: true } // TodoScreen 모달 열기
                    });
                  }}
                />
              </View>
            );
          },
        }}
      />

      {/* ---------------- Teams Tab ---------------- */}
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={focused ? nav_teams :nav_teams_not}
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

      {/* ---------------- MyPage Tab ---------------- */}
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
