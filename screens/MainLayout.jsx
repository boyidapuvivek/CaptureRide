import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Keyboard } from "react-native";
import BottomNavBar from "../components/BottomNavBar";

const MainLayout = ({ children }) => {
  const [isKeyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const keyboardIsShown = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardShown(true)
    );
    const keyboardNotShown = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardShown(false)
    );

    return () => {
      keyboardIsShown.remove();
      keyboardNotShown.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#19252B" style="light" />
      <View style={styles.backgroundContainer}>
        <View style={[styles.backgroundLayer, styles.topBackground]} />
        <View style={[styles.backgroundLayer, styles.bottomBackground]} />
      </View>
      <View style={styles.contentContainer}>{children}</View>
      {!isKeyboardShown && <BottomNavBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 10,
    color: "black",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  topBackground: {
    position: "absolute",
    height: 360,
    backgroundColor: "#19252B",
    zIndex: 1,
  },
  bottomBackground: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  backgroundLayer: {
    width: "100%",
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    zIndex: 3,
  },
});

export default MainLayout;
