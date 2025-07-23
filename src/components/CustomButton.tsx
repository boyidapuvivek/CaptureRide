import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

type Props = {
  title: String;
  onPress: () => {};
};

const CustomButton = ({ title, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
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
