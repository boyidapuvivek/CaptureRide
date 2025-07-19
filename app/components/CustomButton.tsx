import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

type Props = {
  title: String;
  onPress: () => {};
};

const CustomButton = ({ title, onPress }: Props) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  text: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
  },
});

export default CustomButton;
