import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { useFonts } from "expo-font";

function CardBox({ title, color, image }) {
  const words = title.split(" ");
  const [fontLoaded] = useFonts({
    "inter-medium": require("../../assets/fonts/Inter_28pt-Medium.ttf"),
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {words[0] && <Text style={styles.firstWord}>{words[0]}</Text>}
      {words[1] && <Text style={styles.secondWord}>{words[1]}</Text>}
      <View style={styles.imgcontainer}>
        <Image source={image} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: 140,
    width: 205,
    borderRadius: 15,
    padding: 10,
    overflow: "hidden",
    position: "relative",
  },
  firstWord: {
    fontSize: 20,
    lineHeight: 20,
    fontFamily: "inter-medium",
    color: "#ffffff",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  secondWord: {
    fontSize: 20,
    lineHeight: 20,
    fontFamily: "inter-medium",
    color: "#ffffff",
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  imgcontainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    position: "absolute",
    top: 18,
    left: 10,
  },
});

export default CardBox;
