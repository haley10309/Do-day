// src/screens/MyPageScreen.js

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

function MyPageScreen() {
  const host = Platform.select({
    web: "localhost",
    // ios: "172.30.1.78",
    // android: "172.30.1.78",
    ios: "192.0.0.2",
    android: "192.0.0.2",
  });
  const uri = `http://${host}:8082/mypage`;
  if (Platform.OS === "web") {
    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          position: "relative",
        }}
      >
        <iframe
          title="MyPage"
          src={`${uri}?embed=1`}
          style={{
            border: "none",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
          }}
        />
      </div>
    );
  }
  return (
    <WebView
      source={{ uri: `${uri}?embed=1` }}
      originWhitelist={["*"]}
      startInLoadingState
      injectedJavaScript={`(function(){
        try {
          var style = document.createElement('style');
          style.innerHTML = '.nav{display:none!important} main{padding-bottom:24px!important}';
          document.head.appendChild(style);
        } catch (e) {}
      })(); true;`}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {},
  subtitle: {},
});

export default MyPageScreen;
