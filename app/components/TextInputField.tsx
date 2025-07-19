import Colors from "../constants/Colors";
import React, { ReactNode } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type TextInputFieldProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

const TextInputField = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  children,
}: TextInputFieldProps) => {
  return (
    <View style={styles.inputContainer}>
      {children}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 18,

    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  },

  textInput: {
    backgroundColor: Colors.transparent,

    // borderRadius: 18,
    fontFamily: "poppins-regular",
    color: Colors.black,
    height: "auto",
  },
});

export default TextInputField;
