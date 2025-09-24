// src/screens/LoungeScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function LoungeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕹️ 라운지 (미니 게임)</Text>
      <Text style={styles.subtitle}>준비 중인 미니 게임이 있어요!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FFF7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00A86B', // 에메랄드 그린
  },
  subtitle: {
    fontSize: 18,
    color: '#343a40',
  },
});

export default LoungeScreen;