import React from "react";
import { useFonts } from "expo-font";
import images from "../constants/Images";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

function TopBar({ title }) {
  const [fontLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  if (!fontLoaded) {
    return null;
  }
  return (
    <View style={styles.topRow}>
      <Image source={images.topbar.HamBurger} style={styles.topImg} />
      <Text style={styles.text}>{title}</Text>
      <Image source={images.topbar.Profile} style={styles.topImg} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontFamily: "Roboto-Regular",
    color: "#FFFFFF",
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    height: 60,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topImg: {
    width: 80,
    height: 80,
    marginHorizontal: 10,
  },
});

export default TopBar;
