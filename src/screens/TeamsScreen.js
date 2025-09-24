// src/screens/TeamsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TeamsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 팀 채팅방</Text>
      <Text style={styles.subtitle}>길드원들과 소통해보세요!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBEA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500', // 오렌지
  },
  subtitle: {
    fontSize: 18,
    color: '#343a40',
  },
});

export default TeamsScreen;