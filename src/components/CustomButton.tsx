import React from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"

type Props = {
  title: String
  onPress: () => {}
  color?: String
  fontColor?: String
  width?: String
  disable?: Boolean
}

const CustomButton = ({
  title,
  onPress,
  color,
  fontColor,
  width,
  padding,
  disable = false,
}: Props) => {
  const dynamicStyles = {
    backgroundColor: color || Colors.primary,
    width: width || "100%",
  }
  const disableStyles = {
    backgroundColor: Colors.borderColor,
    width: width || "100%",
  }

  return (
    <TouchableOpacity
      style={
        disable
          ? [styles.button, disableStyles]
          : [styles.button, dynamicStyles]
      }
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disable}>
      <Text style={[styles.text, { color: fontColor || Colors.white }]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
  },
  text: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
  },
})

export default CustomButton
