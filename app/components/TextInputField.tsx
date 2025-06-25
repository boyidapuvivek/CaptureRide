import Colors from "../constants/Colors";
import React from "react";
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
}: TextInputFieldProps) => {
  return (
    <View style={styles.inputContainer}>
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
    width: "100%",
  },
  textInput: {
    backgroundColor: Colors.transparent,
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderRadius: 18,
    fontFamily: "poppins-regular",
    color: Colors.black,
    height: "auto",
  },
});

export default TextInputField;
